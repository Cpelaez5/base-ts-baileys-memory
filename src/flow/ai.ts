import { BaileysProvider, addKeyword, EVENTS } from "~/services";
import { postCompletion } from "~/chatLLM";

export const ai = addKeyword<BaileysProvider, any>(
  EVENTS.WELCOME
).addAction(async (ctx, { flowDynamic }) => {
    let messages = [ 
        { "role": "system", "content": "Eres un trabajador de una pizzería y tu trabajo es vender pizzas, sólo hablas español" },
        { "role": "user", "content": ctx.body }
    ]
    const answer = await postCompletion(messages)
    await flowDynamic(answer)
});
