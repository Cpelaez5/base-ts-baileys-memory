import { BaileysProvider, addKeyword } from "~/services";
import {
  eraseUserOrder,
  processResponse,
  errorMessage,
  leerError,
} from "~/utils";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { flowFactura } from "./flowFactura";

export const flowContinue = addKeyword<BaileysProvider, any>(
  "14417333_FLOW_CONTINUE"
).addAnswer(
  [
    "Detectamos un proceso de pedido anteriormente... ¿Desea continuarlo?",
    "👉1️⃣ Sí, Proseguir con mi pedido",
    "👉2️⃣ No, comenzar uno nuevo",
  ],
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const response: any = processResponse(ctx.body);
    if (response <= 2 && response != false) {
      switch (response) {
        case 1:
          return gotoFlow(flowFactura);
        case 2:
          eraseUserOrder(ctx.from);
          await flowDynamic("✅ Iniciando nuevo pedido... ⏳");
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
