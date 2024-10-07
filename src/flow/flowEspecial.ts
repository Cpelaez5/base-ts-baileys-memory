import { BaileysProvider, addKeyword } from "~/services";
import { flowHumano } from "./flowHumano";

export const flowEspecial = addKeyword<BaileysProvider, any>(
  "14417333_FLOWESPECIAL"
).addAction(async (_, { flowDynamic, gotoFlow }) => {
  await flowDynamic(
    "¡Veo que tienes un pedido especial! Te pasaremos con el operador 😉"
  );
  return gotoFlow(flowHumano);
});
