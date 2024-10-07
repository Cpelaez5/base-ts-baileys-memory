import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import {
  analyzeBasic,
  borrar,
  capitalice,
  delay,
  errorMessage,
  getChangeData,
  leerError,
} from "~/utils";
import { flowHumano } from "./flowHumano";
import { flowTamano } from "./flowTamano";
import { flowBebidas } from "./flowBebidas";
import { flowFactura } from "./flowFactura";
import { flowPostres } from "./flowPostres";
import { flowAmount } from "./flowAmount";
import { flowExtras } from "./flowExtras";

export const flowChange2 = addKeyword<BaileysProvider, any>("14417333_CHANGE2")
  .addAction(async (ctx, { flowDynamic, state }) => {
    const message = [];
    let changeData: any = {};
    let pizzaVez = 0;

    try {
      // Intenta leer el archivo .json
      const data = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
      const jsonData = JSON.parse(data); // Accede a las propiedades relevantes
      changeData = jsonData.changeData;
      pizzaVez = jsonData.pizzaVez;
      await state.update({
        changeData: jsonData.changeData,
        pizzaVez: pizzaVez,
      });
    } catch (error) {
      console.log("error en flowChange2.ts al leer json\n"+error); // En caso de error
    }
    const productType = capitalice(changeData.tipo);
      message.push(
        "🟢 *Relizar cambios a producto* 🟢",
        `\nProducto seleccionado: *${productType}*`)
    switch (productType){
      case "Pizza":
        message.push(
          `*${changeData.seleccion.tipo}* (${changeData.seleccion.tamano}) - Cantidad: ${changeData.seleccion.cantidad} = precio: *$${changeData.seleccion.precio}*`,
          "\nEscribe un número según tu decisión 🔢",
          "\n👉1️⃣ Cambiar por otra",
          "👉2️⃣ Agregar Extra(s)",
          "👉3️⃣ Eliminar",
          "👉4️⃣ Cambiar cantidad",
          "👉5️⃣ regresar"
        );
        break;

      default:
        message.push(
          `*${changeData.seleccion.tipo}* - Cantidad: ${changeData.seleccion.cantidad} = precio: *$${changeData.seleccion.precio}*`,
          "\nEscribe un número según tu decisión 🔢",
          "\n👉1️⃣ Cambiar por otro",
          "👉2️⃣ Eliminar",
          "👉3️⃣ Cambiar cantidad",
          "👉4️⃣ regresar"
        );
        break;
    }    
    await flowDynamic(message.join("\n"));
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
      const myState = state.getMyState();
      const changeData = myState.changeData;
      const pizzaVez = myState.pizzaVez;
      const response = analyzeBasic(ctx.body);
      if (response <= 5 && response != false) {
        switch (response) {
          case 1:
            await flowDynamic("Procesando respuesta... ⏳");
            getChangeData(ctx.from, "on"); // Activar cambios
            await delay(1000);
            switch (changeData.tipo) {
              case "pizza":
                return gotoFlow(flowTamano);
              case "bebida":
                return gotoFlow(flowBebidas); //🥤
              case "postre":
                return gotoFlow(flowPostres); //🧁
              case "extra":
                return gotoFlow(flowExtras);  
            }

          case 2:
            await flowDynamic("Procesando respuesta... ⏳"); 
            switch (changeData.tipo) {
              case "pizza":
                getChangeData(ctx.from, "on");
                return gotoFlow(flowExtras); 
                
              default:
                await flowDynamic(
                  borrar(ctx.from, changeData.ubicacion, changeData.tipo, changeData?.ubicacionDelExtra)
                );
                await delay(1000);
                return gotoFlow(flowFactura);
            }

          case 3:
            switch (changeData.tipo) {
              case "pizza":
                if (changeData.tipo == "pizza" && pizzaVez == 1) {
                  await flowDynamic(
                    "Esta pizza no puede ser eliminada de su pedido actual..."
                  );
                  getChangeData(ctx.from, "delete"); // eliminar datos de cambio
  
                } else {
                  await flowDynamic(
                    borrar(ctx.from, changeData.ubicacion, changeData.tipo, changeData?.ubicacionDelExtra)
                  );
                }
                await delay(1000);
                return gotoFlow(flowFactura);

              default:
                return gotoFlow(flowAmount);
            }

          case 4:
            switch (changeData.tipo){
              case "pizza":
                return gotoFlow(flowAmount);

              default:
                getChangeData(ctx.from, "delete"); // eliminar datos de cambio
                return gotoFlow(flowFactura);
            }

          case 5:
            switch (changeData.tipo){
              case "pizza":
                getChangeData(ctx.from, "delete"); // eliminar datos de cambio
                return gotoFlow(flowFactura);

              default:
                await flowDynamic(errorMessage("", "3", ctx.from));
                if (leerError(ctx.from) == 5) {
                  return gotoFlow(flowHumano);
                }
                return fallBack();
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
