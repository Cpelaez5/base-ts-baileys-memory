import { BaileysProvider, addKeyword } from "~/services";
import { analyzeBasic, errorMessage, leerError, metodoEntrega } from "~/utils";
import { flowFactura } from "./flowFactura";
import { flowHumano } from "./flowHumano";

export const flowEntrega = addKeyword<BaileysProvider, any>(
  "14417333_FLOWENTREGA"
).addAnswer(
  [
    "*Métodos de entrega* 🗒️✍️",
    "\nEscribe un número según tu decisión 🔢",
    "\n👉1️⃣ Pedir delivery 🛵",
    "* Se sumará *$1.00* a su pedido",
    "👉2️⃣ Retiro Pick-Up / en tienda 🏬",
    "* No se sumará costo adicional a su pedido",
    "👉3️⃣ Volver",
    "\nEscoge un número según la opción que quieras 🗒️✍️😉👍",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    const response = analyzeBasic(ctx.body);
    if (response <= 3 && response != false) {
      switch (response) {
        case 1: // Delivery
          metodoEntrega(ctx.from, "delivery");
          await flowDynamic("✅ Usted pidió servicio de delivery 🛵");
          return gotoFlow(flowFactura);

        case 2: // Retiro en tienda
          metodoEntrega(ctx.from, "pickUp");
          await flowDynamic("✅ Usted seleccionó retiro Pick-Up 🏬");
          return gotoFlow(flowFactura);

        case 3:
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
