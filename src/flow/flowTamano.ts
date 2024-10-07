import { BaileysProvider, addKeyword } from "~/services";
import { analyzeBasic, errorMessage, leerError } from "~/utils";
import { flowHumano } from "./flowHumano";
import { flowPizzasGrandes } from "./flowPizzasGrandes";
import { flowPizzasPequenas } from "./flowPizzasPequenas";
import { flowConfirm } from "./flowConfirm";

export const flowTamano = addKeyword<BaileysProvider, any>(
  "14417333_FLOWTAMANO"
).addAnswer(
  [
    "¿De qué tamaño deseas tu pizza?",
    "\nEscribe un número según tu decisión 🔢",
    "\n👉1️⃣ *Grande* 🍕",
    "* La pizza grande trae 8 porciones.",
    "👉2️⃣ *Pequeña* 🍕",
    "* La pizza pequeña trae 4 porciones.",
    "\n👉3️⃣ regresar",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    const response = analyzeBasic(ctx.body);
    if (response <= 4 && response != false) {
      switch (response) {
        case 1:
          return gotoFlow(flowPizzasGrandes);

        case 2:
          return gotoFlow(flowPizzasPequenas);

        case 3:
          return gotoFlow(flowConfirm);
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
