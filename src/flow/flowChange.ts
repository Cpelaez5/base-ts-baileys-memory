import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import {
  analyzeBasic,
  assignNumber,
  delay,
  errorMessage,
  getChangeData,
  leerError,
  processChange,
  processEmoji,
} from "~/utils";
import { flowBack } from "./flowBack";
import { flowChange2 } from "./flowChange2";
import { flowHumano } from "./flowHumano";
import { flowFacturaMenu } from "./flowFacturaMenu";

export const flowChange = addKeyword<BaileysProvider, any>(
  "14417333_FLOWCHANGE"
)
  .addAction(async (ctx, { flowDynamic, gotoFlow, state }) => {
    let message = []; // Arreglo para ordenar el mensaje que se va a envíar al usuario
    let jsonData: any = {};
    let pizzas = {};
    let bebidas = {};
    let postres = {};
    let conteo = 0;
    try {
      // Lee el archivo JSON del usuario
      const data = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
      jsonData = JSON.parse(data);

      pizzas = jsonData.pizza; // Accede a las propiedades relevantes
      bebidas = jsonData.bebida;
      postres = jsonData.postre;
    } catch (error) {
      console.log("no se encontró archivo .json para facturar");
      return gotoFlow(flowBack);
    }

    message.push(
      "🔁 *Realizar Cambios* 🔁",
      "\nEscribe el número del producto que quieras modificar 🔢",
      "\n*Pizza(s):* 🍕🍕"
    );

    for (const pizzaId in pizzas) {
      // recorre las pizzas
      const pizza = pizzas[pizzaId];
      conteo++;
      if (pizza.extraVez > 0) {
        message.push(
          `${assignNumber(conteo)}🍕 *${pizza.tipo} (${
            pizza.tamano
          })* - Cantidad: ${pizza.cantidad} - Precio: *$${pizza.precio}*`
        );
        for (const extraId in pizza.extra) {
          conteo++;
          const extra = pizza.extra[extraId];
          message.push(
            `${assignNumber(conteo)} *+* Extra de ${extra.tipo} - Cantidad: ${extra.cantidad} - Precio: *$${extra.precio}*`
          );
        }
      } else {
        message.push(
          `${assignNumber(conteo)}🍕 *${pizza.tipo} (${
            pizza.tamano
          })* - Cantidad: ${pizza.cantidad} - Precio: *$${pizza.precio}*`
        );
      }
    }
    if (jsonData.bebidaVez > 0) {
      // verifica si existen y luego recorre las bebidas
      message.push("\n*Bebida(s):* 🥤🥤");
      for (const bebidaId in bebidas) {
        // recorre las bebidas
        const bebida = bebidas[bebidaId];
        conteo++;
        message.push(
          `${assignNumber(conteo)}🥤 ${bebida.tipo} - Cantidad: ${
            bebida.cantidad
          } - Precio: *$${bebida.precio}*`
        );
      }
    }
    if (jsonData.postreVez > 0) {
      // verifica si existen y luego recorre las bebidas
      message.push("\n*Postre(s):* 🧁🍪");
      for (const postreId in postres) {
        // recorre las postres
        const postre = postres[postreId];
        conteo++;
        message.push(
          `${assignNumber(conteo)}🧁 ${postre.tipo} - Cantidad: ${
            postre.cantidad
          } - Precio: *$${postre.precio}*`
        );
      }
    }
    conteo++;
    message.push(`\n${assignNumber(conteo)} Regresar al menu anterior`);

    await state.update({ lista: message });
    await state.update({ limit: conteo });
    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
      const myState = state.getMyState();
      const limit = myState.limit;
      const lista = myState.lista;
      let conteo = 0;
      let conteopizza = 0;
      let conteobebida = 0;
      let conteopostre = 0;
      let conteoextra = 0;
      let posicion = 0;
      let seleccion = {};
      let type = "";
      const response = analyzeBasic(ctx.body);
      if (response <= limit && response != false) {
        if (response == limit) {
          return gotoFlow(flowFacturaMenu);
        } else {
          await flowDynamic("Procesando Respuesta... ⏳");
          for (const id in lista) {
            const item = lista[id];
            if (item.includes("\uD83D\uDC49")) {
              //👉
              conteo++;
              const emoji = processEmoji(item);
              switch (emoji) {
                case "\uD83C\uDF55":
                  conteopizza++;
                  break; //🍕
                case "\uD83E\uDD64":
                  conteobebida++;
                  break; //🥤
                case "\uD83E\uDDC1":
                  conteopostre++;
                  break; //🧁
                case "+":
                  conteoextra++
                  break;  
              }
              if (response == conteo) {
                switch (emoji) {
                  case "\uD83C\uDF55":
                    posicion = conteopizza;
                    type = "pizza";
                    break; //🍕
                  case "\uD83E\uDD64":
                    posicion = conteobebida;
                    type = "bebida";
                    break; //🥤
                  case "\uD83E\uDDC1":
                    posicion = conteopostre;
                    type = "postre";
                    break;
                  case "+":
                    posicion = conteoextra;
                    type = "extra" 
                    break; // +
                } 
                seleccion = processChange(item,emoji);
                getChangeData(
                  ctx.from,
                  "dataEntry",
                  seleccion,
                  posicion,
                  false,
                  type,
                  conteopizza
                );
                await delay(2000);
                return gotoFlow(flowChange2);
              }
            }
          }
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
