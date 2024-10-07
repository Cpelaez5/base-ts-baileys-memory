import { BaileysProvider, addKeyword } from "~/services";
import { analyzeBasic, errorMessage, leerError } from "~/utils";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { flowGracias } from "./flowGracias";

export const flowNew = addKeyword<BaileysProvider, any>(
  "14417333_FLOWNEW"
).addAnswer(
  [
    "¿Qué deseas hacer? 🤔",
    "\nEscribe un número según tu decisión 🔢",
    "\n👉1️⃣ Volver a pedir 🛒🆕",
    "👉2️⃣ Terminar sesión 🔚",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    const response = analyzeBasic(ctx.body);
    if (response <= 2 && response != false) {
      switch (response) {
        case 1:
          return gotoFlow(flowDirections);

        case 2:
          await flowDynamic("Sesión terminada ☑️");
          return gotoFlow(flowGracias);
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
