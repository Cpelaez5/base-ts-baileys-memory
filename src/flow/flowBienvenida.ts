import { BaileysProvider, EVENTS, addKeyword, readFileSync } from "~/services";
import {
  welcome,
  checkTrue,
  capitalice,
  extractFirstName,
  register,
} from "~/utils";
import { flowContinue } from "./flowContinue";
import { flowDirections } from "./flowDirections";
import { flowNombre } from "./flowNombre";

export const flowBienvenida = addKeyword<BaileysProvider, any>(
  EVENTS.WELCOME
).addAction(async (ctx, { flowDynamic, gotoFlow }) => {
  const wordPizza: string[] = [
    "pizzas",
    "pizza",
    "Pizza",
    "pizzas",
    "PIZZAS",
    "Pizas",
    "pizas",
    "PIZAS",
  ];
  const wordMenu: string[] = ["Menu", "menu", "MENU", "Menú", "menú", "MENÚ"];
  let firstName = "";
  let pizzaVez: any = 0;
  const message = [];
  try {
    const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
    const objetoJSON = JSON.parse(datos);
    pizzaVez = objetoJSON.pizzaVez;
    firstName = capitalice(extractFirstName(objetoJSON.nombre));
    console.log("¡Nueva sesión iniciada!");
    const data: string = welcome(firstName, ctx.body, "Tu Pizzería Preferida");
    message.push(data);
  } catch (err) {
    console.log("¡Usuario nuevo detectado!");
    register(ctx.from);
    message.push(welcome("", ctx.body, "Tu Pizzería Preferida"));
  }

  if (checkTrue(wordPizza, ctx.body)) {
    message.push(`¡Claro que sí! 😉👍 ya te vamos a atender 😋🍕`);
  } else if (checkTrue(wordMenu, ctx.body)) {
    message.push(`¡Claro que sí! 😉👍 ya te vamos a atender 📋`);
  }
  await flowDynamic(message.join("\n"));
  if (pizzaVez > 0) {
    return gotoFlow(flowContinue);
  }
  if (firstName.length >= 3) {
    return gotoFlow(flowDirections);
  } else {
    return gotoFlow(flowNombre);
  }
});
