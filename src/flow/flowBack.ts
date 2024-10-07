import { BaileysProvider, addKeyword } from "~/services";
import { flowFactura } from "./flowFactura";
import { delay, errorMessage, leerError } from "~/utils";
import { flowHumano } from "./flowHumano";

export const flowBack = addKeyword<BaileysProvider, any>(
  "14417333_Flowback"
).addAction(async (ctx, { gotoFlow, flowDynamic }) => {
  await flowDynamic(errorMessage("", "5", ctx.from));
  if (leerError(ctx.from) == 5) {
    return gotoFlow(flowHumano);
  }
  await delay(1500);
  return gotoFlow(flowFactura);
});
