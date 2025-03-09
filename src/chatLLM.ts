// Please install OpenAI SDK first: `npm install openai`
import {OpenAI} from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
		    apiKey: process.env.OPENAI_API_KEY
});

export const toIA = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat", // Asegúrate de que este modelo sea correcto
      messages: messages,
      temperature: 1.3, // Ajusta la temperatura para respuestas más consistentes
      max_tokens: 100, // Limita la longitud de la respuesta
    });

    const answer = completion.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error('Error al obtener la respuesta de la IA:', error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
};

// const openaiReal = new OpenAI({
//   organization: "org-XQtoH9t0Xmi6BDve6QAj6HrP",
//   project: "CPDEV",
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function chatGPT(messages) {
//   try {
//     const completion = await openaiReal.chat.completions.create({
//       messages: messages,
//       model: "gpt-3.5-turbo",
//     });

//     const answer = completion.choices[0].message.content;
//     return answer;
//   } catch (error) {
//     console.error('Error al obtener la respuesta de la IA:', error);
//     return "Lo siento, hubo un error al procesar tu solicitud.";
//   }
// }