import { BaileysProvider, addKeyword } from "~/services";
import { flowDirections } from "./flowDirections";
import { analyzeBasic, errorMessage, leerError, saveExtra } from "~/utils";
import { flowHumano } from "./flowHumano";
import { flowConfirm } from "./flowConfirm";

export const flowExtras2 = addKeyword<BaileysProvider, any>([
  "14417333_EXTRAS2",
])
  .addAction(async (_, { flowDynamic, state }) => {
    let message = [];
    const currentState = state.getMyState();

    message.push(
      "🟢 *CONFIRMACIÓN* 🟢",
      `\nEl extra seleccionado para su pizza ${currentState.pizzaTipo} es: *${currentState.extraType}*`,
      "\n¿Estás de acuerdo? 🤔",
      "\nEscribe el número según tu decisión 🔢",
      "\n👉1️⃣ Sí, agregar a mi pizza",
      "👉2️⃣ No, regresar"
    );

    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
      const response = analyzeBasic(ctx.body);
      if (response <= 2 && response != false) {
        const currentState = state.getMyState();
        switch (response) {
          case 1:
            await flowDynamic(
              saveExtra(
                currentState.phoneNumber, // numero de teléfono del usuario
                currentState.extraType, // tipo del extra seleccionado
                currentState.extraPrice, // precio del extra seleccionado
                currentState.pizzaVez, // posición de la pizza seleccionada
                currentState.extraVez, // posición de el extra dentro de la pizza
                currentState.extraTipo, // tipo del extra seleccionado antes
                currentState.extraCantidad, // cantidad existente del extra seleccionado antes
                currentState.pizzaTipo, // tipo de pizza seleccionada para mostrarle al usuario a que pizza se le agregó el extra
                currentState.pizzaCantidad // cantidad de pizza seleccionada para verificar que la cantidad de extra no sea mayor a la de la pizza
              )
            );
            state.clear();
            return gotoFlow(flowConfirm);

          case 2:
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
  );
