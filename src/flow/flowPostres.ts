import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import {
  delay,
  errorMessage,
  getChangeData,
  guardarPostre,
  isChange,
  leerError,
  processResponse,
  processResponseBasic,
  saveSweet,
} from "~/utils";
import { flowConfirm } from "./flowConfirm";
import { flowFactura } from "./flowFactura";
import { flowChange2 } from "./flowChange2";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { menuPostres } from "~/data/menu";

export const flowPostres = addKeyword<BaileysProvider, any>([
  "14417333_FLOWPOSTRES",
]).addAnswer(
  [
    ////////NUEVO
    "🧁 *POSTRES* 🍪",
    "\nEscribe el número del postre que quieras pedir 🔢",
    "\n👉1️⃣ 🍪 Pasta seca (1 kilo) *$14.2*",
    "👉2️⃣ 🍪 Pasta seca (1/2 kilo) *$7.1*",
    "👉3️⃣ 🍪 Pasta seca (250gr) *$3.55*",
    "👉4️⃣ 🍪 Pasta seca (100gr) *$1.42*",
    "👉5️⃣ 🍰 Porción de Milhojas *$1.50*",
    "👉6️⃣ 🥨 Palmerita Grande  *$1.50*",
    "👉7️⃣ 🍩 Mini donas *3 x $1.00*",
    "\n👉8️⃣ Para ir al menú anterior",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    let isChangeTrue = isChange(ctx.from);
    console.log("valor de isChangeTrue en POSTRES: " + isChangeTrue);

    let textNums = ctx.body.match(/\d+/g);
    const responseZero = processResponse(textNums[0]);

    if (textNums.length > 1) {
      if (isChangeTrue == true) {
        await flowDynamic(
          "Si vas a cambiar un producto, sólo puedes pasar un valor... Vuelve a intentarlo"
        );
        return fallBack();
      } else if (textNums.length > 12) {
        await flowDynamic(
          "Superaste el limite de productos... Vuelve a intentarlo"
        );
        return fallBack();
      }
      for (const id in textNums) {
        const response = processResponse(textNums[id]);
        if (response == false || response > 7) {
          await flowDynamic(
            "Si vas a colocar más de un valor, deben ser válidos todos... Vuelve a intentarlo"
          );
          return fallBack();
        }
      }
      await flowDynamic("Procesando tu pedido, esto podría tardar... ⏳");
    } else if (responseZero == false || responseZero > 7) {
      if (responseZero == 8) {
        if (isChangeTrue == true) {
          getChangeData(ctx.from, "off"); // desactivar cambios
          await flowDynamic("Regresando... ⏳");
          await delay(1500);
          return gotoFlow(flowChange2);
        } else {
          return gotoFlow(flowDirections);
        }
      } else {
        await flowDynamic(errorMessage("", "3", ctx.from));
        if (leerError(ctx.from) == 5) {
          return gotoFlow(flowHumano);
        }
        return fallBack();
      }
    }
    let postreTipo = "";
    let postreVez = 0;
    let postreCantidad: any = 0;
    let changeData: any = {};
    let message = [];
    message.push("✅ Se ha añadido a su carrito:");

    for (const id in textNums) {
      const response: number = processResponseBasic(textNums[id]);
      try {
        const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
        const objetoJSON = JSON.parse(datos);
        console.log("El archivo contiene un JSON válido:", objetoJSON);
        postreVez = objetoJSON.postreVez;
        postreTipo = objetoJSON.postre[postreVez].tipo;
        postreCantidad = objetoJSON.postre[postreVez].cantidad;
        changeData = objetoJSON.changeData || {};
      } catch (err) {
        console.error("Error al leer la postre (probablemente no habían)");
        postreTipo = "";
      }

      const postre = menuPostres[response];

      if (isChangeTrue == true) {
        const cantidad = changeData.seleccion.cantidad;
        const posicion = changeData.ubicacion;
        guardarPostre(
          ctx.from,
          postre.type,
          postre.price * cantidad,
          cantidad,
          posicion,
          "change"
        );
        await flowDynamic(
          `✅ Usted cambió su pedido de ${changeData.seleccion.cantidad} ${
            changeData.seleccion.tipo
          } por ${changeData.seleccion.cantidad} ${
            postre.type
          } dando un valor de *$${postre.price * cantidad.toFixed(2)}*`
        );
        getChangeData(ctx.from, "delete");
        return gotoFlow(flowFactura);
      }

      message.push(
        saveSweet(
          ctx.from,
          postre.type,
          postre.price,
          postreVez,
          postreTipo,
          postreCantidad
        )
      );

      if (textNums.length > 1) {
        await delay(1000);
      }
    }
    await flowDynamic(message.join("\n"));
    return gotoFlow(flowConfirm);
  }
);
