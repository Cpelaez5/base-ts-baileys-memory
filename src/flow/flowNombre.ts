import { BaileysProvider, addKeyword } from "~/services";
import {
  capitalice,
  errorMessage,
  extractFirstName,
  leerError,
  saveName,
} from "~/utils";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";

export const flowNombre = addKeyword<BaileysProvider, any>(
  "DATA_TO_JSON"
).addAnswer(
  "¿Me puede indicar su nombre? por favor 🗒️✍️",
  { capture: true },
  async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    if (ctx.body.length < 3) {
      await flowDynamic(errorMessage("", "3", ctx.from));
      if (leerError(ctx.from) == 5) {
        return gotoFlow(flowHumano);
      }
      return fallBack();
    } else {
      saveName(ctx.from, ctx.body);
      const firstName = capitalice(extractFirstName(ctx.body));
      await flowDynamic(`¡Muchas gracias, ${firstName}!`);
      return gotoFlow(flowDirections);
    }
  }
);
