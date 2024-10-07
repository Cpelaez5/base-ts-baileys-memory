import { BaileysProvider, addKeyword } from "~/services";
import { analyzeBasic, eraseUserOrder, errorMessage, leerError } from "~/utils";
import { flowFactura } from "./flowFactura";
import { flowNew } from "./flowNew";
import { flowHumano } from "./flowHumano";

export const flowCancel = addKeyword<BaileysProvider, any>(
  "14417333_FLOWCANCEL"
).addAnswer(
  [
    "🔄 *REINICIAR/CANCELAR PEDIDO* ❌",
    "\n¿Deseas realizar esta acción? 🤔",
    "(Esta acción borrará el contenido de tu carrito)",
    "\nEscribe un número según tu decisión 🔢",
    "\n👉1️⃣ Sí, proceder",
    "👉2️⃣ No, regresar",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    const response = analyzeBasic(ctx.body);
    if (response <= 2 && response != false) {
      switch (response) {
        case 1:
          eraseUserOrder(ctx.from);
          await flowDynamic("🔄 ¡Pedido reiniciado exitosamente! 😉👍");
          return gotoFlow(flowNew);

        case 2:
          return gotoFlow(flowFactura);
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
