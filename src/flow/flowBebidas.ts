import { BaileysProvider, addKeyword, readFileSync} from "~/services";
import {
  delay,
  errorMessage,
  getChangeData,
  guardarBebida,
  isChange,
  leerError,
  processResponse,
  processResponseBasic,
} from "~/utils";
import { flowChange2 } from "./flowChange2";
import { flowHumano } from "./flowHumano";
import { flowDirections } from "./flowDirections";
import { flowConfirm } from "./flowConfirm";
import { flowFactura } from "./flowFactura";
import { saveDrink } from "~/utils";
import { menuBebidas } from "~/data/menu";

export const flowBebidas = addKeyword<BaileysProvider, any>([
  "14417333_FLOWBEBIDAS",
]).addAnswer(
  [
    //////////NUEVO
    "🥤 *BEBIDAS* 🥤",
    "\nEscribe el número de la bebida que quieras pedir 🔢",
    "\n👉1️⃣ Pepsi de 1.5 litros *$1.9*",
    "👉2️⃣ Pepsi de 2 litros *$2.64*",
    "\n👉3️⃣ Para ir al menú anterior 👈",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    let isChangeTrue = isChange(ctx.from);
    console.log("valor de isChangeTrue en FLOWBEBIDAS: " + isChangeTrue);

    let textNums = ctx.body.match(/\d+/g);
    const responseZero = processResponse(textNums[0]);

    if (textNums.length > 1) {
      if (isChangeTrue == true) {
        await flowDynamic(
          "Si vas a cambiar un producto, sólo puedes pasar un valor... Vuelve a intentarlo"
        );
        return fallBack();
      } else if (textNums.length > 9) {
        await flowDynamic(
          "Superaste el limite de productos... Vuelve a intentarlo"
        );
        return fallBack();
      }
      for (const id in textNums) {
        const response = processResponse(textNums[id]);
        if (response == false || response > 2) {
          await flowDynamic(
            "Si vas a colocar más de un valor, deben ser válidos todos... Vuelve a intentarlo"
          );
          return fallBack();
        }
      }
      await flowDynamic("Procesando tu pedido, esto podría tardar... ⏳");
    } else if (responseZero == false || responseZero > 2) {
      if (responseZero == 3) {
        if (isChangeTrue == true) {
          getChangeData(ctx.from, "off"); // desactivar cambios
          await flowDynamic("Regresando... ⏳");
          await delay(1500);
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

    let bebidaTipo = "";
    let bebidaVez = 0;
    let bebidaCantidad = 0;
    let changeData: any = {};
    let message = [];

    message.push("✅ Se ha añadido a su carrito:");
    for (const id in textNums) {
      const response: number = processResponseBasic(textNums[id]);
      try {
        const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
        const objetoJSON: any = JSON.parse(datos);
        console.log("El archivo contiene un JSON válido:", objetoJSON);
        bebidaVez = objetoJSON.bebidaVez;
        bebidaTipo = objetoJSON.bebida[bebidaVez].tipo;
        bebidaCantidad = objetoJSON.bebida[bebidaVez].cantidad;
        changeData = objetoJSON.changeData || {};
      } catch (err) {
        console.error("Error al leer la bebida (probablemente no habían)");
        bebidaTipo = "";
      }

      const bebidaSelected: any = menuBebidas[response];

      if (isChangeTrue == true) {
        const cantidad = changeData.seleccion.cantidad;
        const posicion = changeData.ubicacion;
        guardarBebida(
          ctx.from,
          bebidaSelected.type,
          bebidaSelected.price * cantidad,
          cantidad,
          posicion,
          "change"
        );
        await flowDynamic(
          `✅ Usted cambió su pedido de ${changeData.seleccion.cantidad} ${
            changeData.seleccion.tipo
          } por ${changeData.seleccion.cantidad} ${
            bebidaSelected.type
          } dando un valor de *$${bebidaSelected.price * cantidad.toFixed(2)}*`
        );
        getChangeData(ctx.from, "delete");
        return gotoFlow(flowFactura);
      }

      message.push(
        saveDrink(
          ctx.from,
          bebidaSelected.type,
          bebidaSelected.price,
          bebidaVez,
          bebidaTipo,
          bebidaCantidad
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
