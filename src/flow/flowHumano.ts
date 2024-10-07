import { BaileysProvider, addKeyword } from "~/services";
import { eraseUserOrder } from "~/utils";

export const flowHumano = addKeyword<BaileysProvider, any>([
  "operador",
  "humano",
  "persona",
  "quiero que me atienda un",
  "no quiero hablar",
  "detener bot",
  "soporte",
  "ayuda",
]).addAction(async (ctx, { flowDynamic }) => {
  eraseUserOrder(ctx.from);
  await flowDynamic(
    "✅ En breves momentos te comunicaremos con personal de atención al cliente 😉👍"
  );
});
