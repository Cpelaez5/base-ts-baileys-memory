// import { join } from 'path'
import { createBot, createProvider, createFlow } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { flows } from "./flow";
const PORT = process.env.PORT ?? 3008;

// const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
//     .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })



const main = async () => {
  const adapterFlow = createFlow(flows);

  const adapterProvider = createProvider(Provider);
  const adapterDB = new Database();

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.on("message", (payload) => {
    console.log("Name:", payload.name, "\n");
    console.log("Message:", payload.body, "\n");
    console.log("------------------------------------");
  });

  httpServer(+PORT);
};

main();
