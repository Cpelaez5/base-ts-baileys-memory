import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import { analyzeBasic, errorMessage, leerError } from "~/utils";
import { flowCancel } from "./flowCancel";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { flowChange } from "./flowChange";
import { flowPayMethods } from "./flowPayMethods";
import { flowEntrega } from "./flowEntrega";

export const flowFacturaMenu = addKeyword<BaileysProvider, any>(
  "14417333_MENUFACTURA"
)
  .addAction(async (ctx, { flowDynamic, state }) => {
    let jsonData: any = {};
    let metodoEntrega = "entr";

    try {
      const data = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8"); // Lee el archivo JSON
      jsonData = JSON.parse(data); // Accede a las propiedades relevantes
      metodoEntrega = jsonData.entrega || "entr";
    } catch (error) {
      console.log("ERROR! AL BUSCAR JSON EN flowFacturaMenu");
    }
    await state.update({ entrega: metodoEntrega });
    let message = [];
    message.push("Escribe un número según tu decisión 🔢\n");

    if (metodoEntrega.length == 4) {
      message.push(
        "👉1️⃣ Seguir comprando 🛒",
        "👉2️⃣ Realizar cambios 🔃",
        "👉3️⃣ Ir a métodos de entrega 🛵",
        "👉4️⃣ Reiniciar/cancelar pedido 🔄"
      );
    } else if (metodoEntrega.length >= 6) {
      message.push(
        "👉1️⃣ Seguir comprando 🛒",
        "👉2️⃣ Realizar cambios 🔃",
        "👉3️⃣ Ir métodos de pago 💳",
        "👉4️⃣ Método de entrega 🛵",
        "👉5️⃣ Reiniciar/cancelar pedido 🔄"
      );
    }
    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
      const myState = state.getMyState();
      let entrega = myState.entrega || "entr";
      const response = analyzeBasic(ctx.body);
      if (response <= 5 && response != false) {
        switch (response) {
          case 1: // seguir comprando
            return gotoFlow(flowDirections);
          case 2: // realizar cambios
            return gotoFlow(flowChange);
          case 3:
            if (entrega.length >= 6) {
              // ir a metodos de pago
              return gotoFlow(flowPayMethods);
            }
            return gotoFlow(flowEntrega); //ir a metodos de entrega

          case 4:
            if (entrega.length >= 6) {
              // metodos de entrega
              return gotoFlow(flowEntrega);
            }
            return gotoFlow(flowCancel); //reiniciar/cancelar pedido

          case 5:
            if (entrega.length >= 6) {
              // reiniciar/cancelar pedido
              return gotoFlow(flowCancel);
            }
            await flowDynamic(errorMessage("", "3", ctx.from)); //error
            if (leerError(ctx.from) == 5) {
              return gotoFlow(flowHumano);
            }
            return fallBack();
        }
      } else {
        await flowDynamic(errorMessage("", "3", ctx.from));
        if (leerError(ctx.from) == 5) {
          return gotoFlow(flowHumano);
        }
        return fallBack();
      }
    }
  );
