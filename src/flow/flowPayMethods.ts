import { BaileysProvider, addKeyword } from "~/services";
import { analyzeBasic, errorMessage, leerError } from "~/utils";
import { flowHumano } from "./flowHumano";
import { flowVerificate } from "./flowVerificate";
import { flowFacturaMenu } from "./flowFacturaMenu";

export const flowPayMethods = addKeyword<BaileysProvider, any>(
  "14417333_FLOWPAYMETHODS"
).addAnswer(
  [
    "*MÉTODOS DE PAGO* 💳💵",
    "(Recuerda siempre envíar comprobante de pago)",
    "\nEscribe el número de tu método de pago 🔢",
    "\n👉1️⃣ Divisas",
    "👉2️⃣ Pago móvil",
    "👉3️⃣ Bolívares en efectivo",
    "👉4️⃣ Regresar",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    const response = analyzeBasic(ctx.body);
    if (response <= 4 && response != false) {
      switch (response) {
        case 1:
          await flowDynamic("✅ Divisas");
          state.update({
            payMethod: "divisas",
          });
          return gotoFlow(flowVerificate);

        case 2:
          await flowDynamic("✅ Pago móvil");
          state.update({
            payMethod: "pago móvil",
          });
          return gotoFlow(flowVerificate);

        case 3:
          await flowDynamic("✅ Bolívares en efectivo");
          state.update({
            payMethod: "bolívares en efectivo",
          });

        case 4:
          return gotoFlow(flowFacturaMenu);
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
