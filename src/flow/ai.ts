import { BaileysProvider, addKeyword, EVENTS} from "~/services";
import { toIA } from "~/chatLLM";

export const ai = addKeyword<BaileysProvider, any>(
  EVENTS.WELCOME
).addAction(async (ctx, { flowDynamic }) => {
  try {
    let messages = [
      { role: "system", content: `tu propósito es vender bots de WhatsApp, y estas atendiendo a un usuario llamado "${ctx.name}". Responde de forma amigable, breve y corta`},
      { role: "user", content: ctx.body, name: "User " }
    ];

    const answer = await toIA(messages);

    if (answer) {
      console.log('Respuesta de la IA:', answer);  
      await flowDynamic(answer);
    } else {
      await flowDynamic("Lo siento, no pude procesar tu solicitud en este momento.");
    }
  } catch (error) {
    console.error('Error en la acción de bienvenida:', error);
    await flowDynamic("Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.");
  }
});