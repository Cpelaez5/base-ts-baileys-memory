import { BaileysProvider, addKeyword, readFileSync} from "~/services";
import { errorMessage, leerError, saveExtra, isChange, delay, getChangeData, processResponse, processResponseBasic, guardarExtra } from "~/utils";
import { flowConfirm } from "./flowConfirm"
import { flowChange2 } from "./flowChange2"
import { flowDirections } from "./flowDirections";
import { flowHumano } from "./flowHumano";
import { menuExtras } from "~/data/menu";
import { flowFactura } from "./flowFactura";

export const flowExtras = addKeyword<BaileysProvider, any>([
  "14417333_FLOWEXTRAS",
]).addAnswer(
  [
    "🍕🥓 *EXTRAS* 🧄🌽",
    "\nEscribe el número del extra que quieras añadir 🔢",
    "\n👉1️⃣ Cebolla *$0.30*",
    "👉2️⃣ Queso mozzarella *$0.76*",
    "👉3️⃣ Aceitunas negras *$0.80*",
    "👉4️⃣ Queso parmesano *$0.98*",
    "👉5️⃣ Maíz *$1.00*",
    "👉6️⃣ Tomates confitados *$1.50*",
    "👉7️⃣ Jamón *$1.61*",
    "👉8️⃣ Champiñones *$2.00*",
    "👉9️⃣ Borde de queso *$2.00*",
    "👉🔟 Tocineta *$2.50*",
    "👉1️⃣1️⃣ Anchoas *$2.50*",
    "👉1️⃣2️⃣ Pimentón *$2.50*",
    "👉1️⃣3️⃣ Pepperoni *$2.50*",
    "\n👉1️⃣4️⃣ para ir al menú anterior",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
    let isChangeTrue = isChange(ctx.from)
    console.log('valor de isChangeTrue en FLOWEXTRAS: '+isChangeTrue)

    let textNums = ctx.body.match(/\d+/g)
    const responseZero = processResponse(textNums[0])

    if(textNums.length>1){
        if (isChangeTrue==true) {
            await flowDynamic('Si vas a cambiar un producto, sólo puedes pasar un valor... Vuelve a intentarlo')
            return fallBack()
        }
        for(const id in textNums){
            const response = processResponse(textNums[id])
            if((response==false)||(response>13)){
                await flowDynamic('Si vas a colocar más de un valor, deben ser válidos todos... Vuelve a intentarlo')
                return fallBack()
            }
        }
        await flowDynamic('Procesando tu pedido, esto podría tardar... ⏳')
    }else if((responseZero==false)||(responseZero>13)){
        if(responseZero==14){
            if(isChangeTrue==true){
                getChangeData(ctx.from,'off') // desactivar cambios
                await flowDynamic('Regresando... ⏳')
                delay(2000)
                return gotoFlow(flowChange2)
            }else{
                return gotoFlow(flowDirections)
            }
        }else{
            await flowDynamic(errorMessage('','3',ctx.from))
            if (leerError(ctx.from) == 5) {
                return gotoFlow(flowHumano);
            }
            return fallBack()
        }
    }

    let extraTipo = "";
    let extraVez = 0;
    let pizzaVez = 0;
    let pizzaTipo = "";
    // let extraTipoLast = ""; // Mejorar con ciclo for
    let pizzaCantidad = 0;
    let extraCantidad = 0;
    let objetoJSON: any = {};
    let changeData:any = {}
    let message = []
    // let extraTipoAnterior = ""; // Mejorar con ciclo for
    message.push('✅ Se ha añadido a su pizza:')
    for (const id in textNums) {
      const response: number = processResponseBasic(textNums[id]);
      try {
        const datos = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
        objetoJSON = JSON.parse(datos);
        console.log("El archivo contiene un JSON válido:", objetoJSON);
        pizzaVez = objetoJSON.pizzaVez;
        pizzaCantidad = objetoJSON.pizza[pizzaVez].cantidad;
        pizzaTipo = objetoJSON.pizza[pizzaVez].tipo;
        extraVez = objetoJSON.pizza[pizzaVez].extraVez;
        extraTipo = objetoJSON.pizza[pizzaVez].extra[extraVez].tipo;
        extraCantidad = objetoJSON.pizza[pizzaVez].extra[extraVez].cantidad;
        changeData = objetoJSON.changeData || {};
        // extraTipoLast = objetoJSON.pizza[pizzaVez].extra[extraVez-2].tipo; //  Mejorar con ciclo for
        // extraTipoAnterior = objetoJSON.pizza[pizzaVez].extra[extraVez-1].tipo;
      } catch (err) {
        console.error("Error al leer los extras (probablemente no habían)");
      }

      const extra = menuExtras[response];

      // state.update({
      //   phoneNumber: ctx.from,
      //   extraType: extra.type,
      //   extraPrice: extra.price,
      //   pizzaVez: pizzaVez,
      //   extraVez: extraVez,
      //   extraTipo: extraTipo,
      //   extraCantidad: extraCantidad,
      //   pizzaTipo: pizzaTipo,
      //   pizzaCantidad: pizzaCantidad,
      // });

      if (isChangeTrue == true&&changeData.tipo=="extra") {
        const cantidad = changeData.seleccion.cantidad;
        const posicion = changeData.ubicacion;
        const posicionDelExtra = changeData.ubicacionDelExtra;
        guardarExtra(
          ctx.from,
          extra.type,
          extra.price * cantidad,
          cantidad,
          posicion,
          posicionDelExtra,
          "change"
        );
        await flowDynamic(
          `✅ Usted cambió su pedido de ${changeData.seleccion.cantidad} ${
            changeData.seleccion.tipo
          } por ${changeData.seleccion.cantidad} ${
            extra.type
          } dando un valor de *$${extra.price * cantidad.toFixed(2)}*`
        );
        getChangeData(ctx.from, "delete");
        return gotoFlow(flowFactura);
      }
      if((isChangeTrue == true)&&(changeData.tipo=="pizza")){
        await flowDynamic(saveExtra(
          ctx.from, // numero de teléfono del usuario
          extra.type, // tipo del extra seleccionado
          extra.price, // precio del extra seleccionado
          changeData.ubicacionDelExtra, // posición de la pizza seleccionada
          objetoJSON.pizza[(changeData.ubicacion).toString()].extraVez, // posición de el extra dentro de la pizza
          objetoJSON.pizza[(changeData.ubicacion).toString()].extra[objetoJSON.pizza[(changeData.ubicacion).toString()].extraVez]?.tipo, // tipo del extra seleccionado antes
          objetoJSON.pizza[(changeData.ubicacion).toString()].extra[(objetoJSON.pizza[(changeData.ubicacion).toString()].extraVez).tostring]?.cantidad, // cantidad existente del extra seleccionado antes
          changeData.seleccion.tipo, // tipo de pizza seleccionada para mostrarle al usuario a que pizza se le agregó el extra
          changeData.seleccion.cantidad // cantidad de pizza seleccionada para verificar que la cantidad de extra no sea mayor a la de la pizza
      ))
        getChangeData(ctx.from, "delete");
        return gotoFlow(flowFactura);
      }

      message.push(saveExtra(
          ctx.from, // numero de teléfono del usuario
          extra.type, // tipo del extra seleccionado
          extra.price, // precio del extra seleccionado
          pizzaVez, // posición de la pizza seleccionada
          extraVez, // posición de el extra dentro de la pizza
          extraTipo, // tipo del extra seleccionado antes
          extraCantidad, // cantidad existente del extra seleccionado antes
          pizzaTipo, // tipo de pizza seleccionada para mostrarle al usuario a que pizza se le agregó el extra
          pizzaCantidad // cantidad de pizza seleccionada para verificar que la cantidad de extra no sea mayor a la de la pizza
      ))

      if (textNums.length>1) {
          await delay(1000)
      }
    }
    await flowDynamic(message.join('\n'))
    return gotoFlow(flowConfirm);
  }
);
