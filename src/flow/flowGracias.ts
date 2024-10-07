import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import { capitalice, extractFirstName } from "~/utils";

export const flowGracias = addKeyword<BaileysProvider, any>(
  "FLOWGRACIAS"
).addAction(async (ctx, { flowDynamic }) => {
  try {
    const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
    const objetoJSON = JSON.parse(datos);
    const firstName = capitalice(extractFirstName(objetoJSON.nombre));
    await flowDynamic(
      `Gracias por comunicarte con nosotros, ${firstName} 😉🙏✨`
    );
    await flowDynamic("Siempre a la orden 😌🙏");
  } catch (err) {
    await flowDynamic(`Gracias por comunicarte con nosotros 😉🙏✨`);
    await flowDynamic("Siempre a la orden 😌🙏");
  }
});
