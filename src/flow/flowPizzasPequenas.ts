import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import {
  delay,
  errorMessage,
  getChangeData,
  isChange,
  leerError,
  processResponse,
  processResponseBasic,
  savePizza,
  saveUserOrder,
} from "~/utils";
import { flowEspecial } from "./flowEspecial";
import { flowChange2 } from "./flowChange2";
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { flowConfirm } from "./flowConfirm";
import { flowFactura } from "./flowFactura";
import { menuPizzasPq } from "~/data/menu";

export const flowPizzasPequenas = addKeyword<BaileysProvider, any>([
  "14417333_flowPZPQ",
]).addAnswer(
  [
    /////////////NUEVO
    "*Pizzas 🍕 Pequeñas*",
    "\nEscribe el número de la pizza que quieras pedir 🔢",
    "\n👉1️⃣ Margarita 🍕 *$3.00*",
    "👉2️⃣ Jamón y queso 🍕 *$3.00*",
    "👉3️⃣ Pepperoni 🍕 *$3.50*",
    "👉4️⃣ Napolitana 🍕 *$3.50*",
    "👉5️⃣ Tocineta 🍕 *$4.00*",
    "👉6️⃣ Vegetales 🍕 *$4.00*",
    "👉7️⃣ Mediterránea 🍕 *$6.00*",
    "👉8️⃣ Zendaya 🍕 *$4.50*",
    "👉9️⃣ Brioche 🍕 *$6.50*",
    "\n👉1️⃣0️⃣ Para ir al menú anterior",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    let isChangeTrue = isChange(ctx.from);
    console.log("valor de isChangeTrue en PZPQ: " + isChangeTrue);

    let textNums = ctx.body.match(/\d+/g);
    const responseZero = processResponse(textNums[0]);
    if (textNums.length > 1) {
      if (isChangeTrue == true) {
        await flowDynamic(
          "Si vas a cambiar un producto, sólo puedes pasar un valor... Vuelve a intentarlo"
        );
        return fallBack();
      } else if (textNums.length > 9) {
        return gotoFlow(flowEspecial);
      }
      for (const id in textNums) {
        const response = processResponse(textNums[id]);
        if (response == false || response > 9) {
          await flowDynamic(
            "Si vas a colocar más de un valor, deben ser válidos todos... Vuelve a intentarlo"
          );
          return fallBack();
        }
      }
      await flowDynamic("Procesando tu pedido, esto podría tardar... ⏳");
    } else if (responseZero == false || responseZero > 9) {
      if (responseZero == 10) {
        if (isChangeTrue == true) {
          getChangeData(ctx.from, "off"); // desactivar cambios
          await flowDynamic("Regresando... ⏳");
          await delay(2000);
          return gotoFlow(flowChange2);
        } else {
          return gotoFlow(flowDirections);
        }
      } else {
        await flowDynamic(errorMessage("", "3", ctx.from));
        if (leerError(ctx.from) == 5) {
          return gotoFlow(flowHumano);
        }
        return fallBack();
      }
    }
    let pizzaTipo = "";
    let pizzaTamano = "";
    let pizzaCantidad = 0;
    let pizzaVez = 0;
    let objetoJSON: any = {};
    let changeData: any = {};
    let message = [];
    message.push("✅ Se ha añadido a su carrito:");
    for (const id in textNums) {
      const response = processResponseBasic(textNums[id]);

      try {
        const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
        objetoJSON = JSON.parse(datos);
        console.log("El archivo contiene un JSON válido:", objetoJSON);
        pizzaVez = objetoJSON.pizzaVez;
        pizzaTipo = objetoJSON.pizza[pizzaVez].tipo;
        pizzaTamano = objetoJSON.pizza[pizzaVez].tamano;
        pizzaCantidad = objetoJSON.pizza[pizzaVez].cantidad;
        changeData = objetoJSON.changeData;
      } catch (err) {
        console.error("Error al leer las pizzas (probablemente no habían)");
        pizzaTipo = "";
        pizzaTamano = "";
      }

      const pizzaSelect = menuPizzasPq[response];
      pizzaSelect.size = "pequeña";

      if (isChangeTrue == true) {
        const cantidad = changeData.seleccion.cantidad;
        const posicion = changeData.ubicacion;
        saveUserOrder(
          ctx.from,
          pizzaSelect.type,
          pizzaSelect.size,
          pizzaSelect.price * cantidad,
          cantidad,
          posicion
        );
        await flowDynamic(
          `✅ Se cambió su pedido de ${
            changeData.seleccion.cantidad
          } pizza(s) 🍕 ${changeData.seleccion.tipo} (${
            changeData.seleccion.tamano
          }) por ${changeData.seleccion.cantidad} pizza(s) ${
            pizzaSelect.type
          } (${pizzaSelect.size}) dando un valor de *$${
            pizzaSelect.price * cantidad
          }*`
        );
        getChangeData(ctx.from, "delete");
        return gotoFlow(flowFactura);
      }
      message.push(
        savePizza(
          ctx.from, // phoneNumber
          pizzaSelect.type, // type
          pizzaSelect.price, // price
          pizzaSelect.size, //size
          pizzaVez, // pizzaVez
          pizzaTipo, // pizzaTipo
          pizzaTamano, // pizzaTamano
          pizzaCantidad // pizzaCantidad
        )
      );

      if (textNums.length > 1) {
        await delay(1000);
      }
    }
    await flowDynamic(message.join("\n"));
    return gotoFlow(flowConfirm);
  }
);
