import { BaileysProvider, addKeyword } from "~/services";
import {
  analyzeBasic,
  cambiarCantidad,
  delay,
  errorMessage,
  getChangeData,
  getType,
  leerError,
} from "~/utils";
import { flowChange } from "./flowChange";
import { flowEspecial } from "./flowEspecial";
import { flowFactura } from "./flowFactura";
import { flowHumano } from "./flowHumano";

export const flowAmount = addKeyword<BaileysProvider, any>(
  "14417333_FLOWAMOUNT"
).addAnswer(
  [
    "🔄 *Cambiar cantidad de producto seleccionado* 🔄",
    "\nEscribe la nueva cantidad del producto en números 🔢",
    '\nde lo contrario escribe *"regresar"*',
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    const response = await analyzeBasic(ctx.body);
    if (response != false) {
      if (response >= 10 && getType(ctx.from) == "pizza") {
        return gotoFlow(flowEspecial);
      }
      await flowDynamic("Realizando acción... ⏳");
      cambiarCantidad(ctx.from, response);
      await delay(1000);
      getChangeData(ctx.from, "delete"); // eliminar datos de cambio
      await delay(1000);
      await flowDynamic("✅ ¡Cambio de cantidad realizado!");
      return gotoFlow(flowFactura);
    } else if (ctx.body.includes("regresar") || ctx.body.includes("Regresar")) {
      return gotoFlow(flowChange);
    } else {
      await flowDynamic(errorMessage("", "3", ctx.from));
      if (leerError(ctx.from) == 5) {
        return gotoFlow(flowHumano);
      }
      return fallBack();
    }
  }
);
