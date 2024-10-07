import { BaileysProvider, addKeyword } from "~/services";
import {
  analyzeBasic,
  delay,
  errorMessage,
  finished,
  leerError,
  metodoPago,
} from "~/utils";
import { flowHumano } from "./flowHumano";
import { flowPayMethods } from "./flowPayMethods";

export const flowVerificate = addKeyword<BaileysProvider, any>(
  "14417333_FLOWVERIFICATE"
)
  .addAction(async (_, { flowDynamic, state }) => {
    let message = [];
    const currentState = state.getMyState();

    message.push(
      "🟢 *CONFIRMACIÓN* 🟢",
      `\nEl metodo de pago seleccionado es: *${currentState.payMethod}* 🪙`,
      "\n¿Estás de acuerdo? 🤔",
      "\nEscribe el número según tu decisión 🔢",
      "\n👉1️⃣ Sí, Proceder con la compra",
      "👉2️⃣ No, regresar"
    );

    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
      const response = analyzeBasic(ctx.body);
      if (response <= 2 && response != false) {
        switch (response) {
          case 1:
            const currentState = state.getMyState();
            metodoPago(ctx.from, currentState.payMethod);
            await flowDynamic("✅ ¡Perfecto! Estamos procesando tu pedido");
            finished(ctx.from);
            await delay(1500);
            return gotoFlow(flowHumano);

          case 2:
            return gotoFlow(flowPayMethods);
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
