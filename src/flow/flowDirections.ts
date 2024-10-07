import { BaileysProvider, addKeyword, readFileSync} from "~/services";
import { analyzeBasic, errorMessage, leerError } from "~/utils";
import { flowBienvenida } from "./flowBienvenida";
import { flowHumano } from "./flowHumano";
import { flowPizzasGrandes } from "./flowPizzasGrandes";
import { flowNew } from "./flowNew";
import { flowBebidas } from "./flowBebidas";
import { flowPizzasPequenas } from "./flowPizzasPequenas";
import { flowPostres } from "./flowPostres";
import { flowFactura } from "./flowFactura";
import { flowCancel } from "./flowCancel";

export const flowDirections = addKeyword<BaileysProvider, any>(
  "14417333_FLOWDIRECTIONS"
)
  .addAction(async (ctx, { flowDynamic, gotoFlow, state }) => {
    const message = [];
    let pizzaVez = 0;
    try {
      const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
      const objetoJSON = JSON.parse(datos);
      pizzaVez = objetoJSON.pizzaVez;
    } catch (err) {
      console.error("flowDirections Error para encontrar el JSON");
      return gotoFlow(flowBienvenida); // regresar principio para tomar datos
    }
    message.push(
      "*menú principal* 🗒️😉",
      "\nEscribe un número según tu decisión 🔢"
    );
    if (pizzaVez == 0) {
      message.push(
        "\n👉1️⃣ Menú de pizzas *grandes* 🍕",
        "* La pizza grande trae 8 porciones.",
        "👉2️⃣ Menú de pizzas *pequeñas* 🍕",
        "* La pizza pequeña trae 4 porciones.",
        "\n👉6️⃣ cancelar 🚫"
      );
      await state.update({ Menu: 1 });
    } else {
      message.push(
        "\n👉1️⃣ pizzas *grandes* 🍕",
        "👉2️⃣ pizzas *pequeñas* 🍕",
        "👉3️⃣ bebidas 🥤",
        "👉4️⃣ postres 🧁🍪",
        "👉5️⃣ mi carrito 🛒",
        "\n👉6️⃣ cancelar mi orden 🚫"
      );
      await state.update({ Menu: 2 });
    }
    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
      const response = analyzeBasic(ctx.body);

      if (response <= 6 && response != false) {
        const myState = state.getMyState();

        switch (response) {
          case 1:
            return gotoFlow(flowPizzasGrandes);

          case 2:
            return gotoFlow(flowPizzasPequenas);

          case 3:
            if (myState.Menu == 1) {
              await flowDynamic(errorMessage("", "3", ctx.from));
              if (leerError(ctx.from) == 5) {
                return gotoFlow(flowHumano);
              }
              return fallBack();
            }
            return gotoFlow(flowBebidas);

          case 4:
            if (myState.Menu == 1) {
              await flowDynamic(errorMessage("", "3", ctx.from));
              if (leerError(ctx.from) == 5) {
                return gotoFlow(flowHumano);
              }
              return fallBack();
            }
            return gotoFlow(flowPostres);

          case 5:
            if (myState.Menu == 1) {
              await flowDynamic(errorMessage("", "3", ctx.from));
              if (leerError(ctx.from) == 5) {
                return gotoFlow(flowHumano);
              }
              return fallBack();
            }
            return gotoFlow(flowFactura);

          case 6:
            if (myState.Menu == 1) {
              return gotoFlow(flowNew);
            }
            return gotoFlow(flowCancel);

          default:
            await flowDynamic(errorMessage("", "3", ctx.from));
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
