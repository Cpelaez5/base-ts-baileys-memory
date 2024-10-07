import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import { analyzeBasic, delay, errorMessage, leerError } from "~/utils";
import { flowBebidas } from "./flowBebidas";
import { flowDirections } from "./flowDirections";
import { flowExtras } from "./flowExtras";
import { flowHumano } from "./flowHumano";
import { flowPostres } from "./flowPostres";
import { flowTamano } from "./flowTamano";
import { flowFactura } from "./flowFactura";
import { flowChange } from "./flowChange";

export const flowConfirm = addKeyword<BaileysProvider, any>(
  "14417333_FLOWCONFIRM"
)
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    await delay(1000);
    let message = [];
    let productType = "";

    try {
      // Intenta leer el archivo .json
      const data = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
      const jsonData = JSON.parse(data); // Accede a las propiedades relevantes
      productType = jsonData.changeData.tipo;
      await state.update({ productType: productType });
    } catch (error) {
      // En caso de error
      return gotoFlow(flowFactura);
    }

    message.push(
      "¿Qué deseas hacer? 🗒️✍️\nEscribe un número según tu decisión 🔢\n\n👉1️⃣ Seguir comprando 🛒"
    );

    switch (productType) {
      case "pizza": // 🍕
        message.push(
          "👉2️⃣ Agregar extra a la pizza 🥓",
          "👉3️⃣ Menú de bebidas 🥤",
          "👉4️⃣ Modificar pedido 🔃",
          "👉5️⃣ Ver mi carrito 🛒"
        );
        break;
      case "bebida": // 🥤
        message.push(
          "👉2️⃣ Menú de postres 🧁",
          "👉3️⃣ Modificar pedido 🔃",
          "👉4️⃣ Ver mi carrito 🛒"
        );
        break;
      case "postre": // 🧁
        message.push(
          "👉2️⃣ Menú de pizzas 🍕",
          "👉3️⃣ Modificar pedido 🔃",
          "👉4️⃣ Ver mi carrito 🛒"
        );
        break;
      case "extra": // 🍕
        message.push(
          "👉2️⃣ Agregar otro extra a la pizza 🥓",
          "👉3️⃣ Menú de bebidas 🥤",
          "👉4️⃣ Modificar pedido 🔃",
          "👉5️⃣ Ver mi carrito 🛒"
        );
        break;
    }
    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
      const myState = state.getMyState();
      const productType = myState.productType;
      const response = analyzeBasic(ctx.body);
      if (response <= 5 && response != false) {
        switch (response) {
          case 1:
            return gotoFlow(flowDirections);
          case 2:
            switch (productType) {
              case "extra":
              case "pizza": // Agregar extra a la pizza 🥓
                return gotoFlow(flowExtras);
              case "bebida": // Menú de postres 🧁
                return gotoFlow(flowPostres);
              case "postre": // Menú de pizzas 🍕
                return gotoFlow(flowTamano);
            }
          case 3:
            switch (productType) {
              case "extra":
              case "pizza": // Agregar bebida 🥤
                return gotoFlow(flowBebidas);
              default: // Modificar pedido 🔃
                return gotoFlow(flowChange);
            }
          case 4:
            switch (productType) {
              case "extra":
              case "pizza": // Modificar pedido 🔃
                return gotoFlow(flowChange);
              default:
                return gotoFlow(flowFactura);
            }
          case 5:
            switch (productType) {
              case "extra":
              case "pizza": // Ver mi carrito
                return gotoFlow(flowFactura);
              default: // ERROR
                await flowDynamic(errorMessage("", "3", ctx.from));
                if (leerError(ctx.from) == 5) {
                  return gotoFlow(flowHumano);
                }
                return fallBack();
            }
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
