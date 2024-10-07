import { BaileysProvider, addKeyword, readFileSync } from "~/services";
import { flowBack } from "./flowBack";
import { saveTotal } from "~/utils";
import { flowFacturaMenu } from "./flowFacturaMenu";

export const flowFactura = addKeyword<BaileysProvider, any>(
  "14417333_FLOWFACTURA"
).addAction(async (ctx, { flowDynamic, gotoFlow }) => {
  await flowDynamic("Cargando tu pedido... ⏳");
  let totalPizzas = 0;
  let totalBebidas = 0;
  let totalPostres = 0;
  let totalDelivery = 0;
  let totalExtras = 0;
  let jsonData: any = {};
  let pizzas = {};
  let bebidas = {};
  let postres = {};
  let total: any = 0;
  let metodoEntrega = "entr";
  let pago = "pago";
  try {
    // Lee el archivo JSON
    const data = readFileSync(`./src/data/users/${ctx.from}.json`, "utf8");
    jsonData = JSON.parse(data);
    // Accede a las propiedades relevantes
    pizzas = jsonData.pizza;
    bebidas = jsonData.bebida;
    postres = jsonData.postre;
    metodoEntrega = jsonData.entrega || "entr";
    pago = jsonData.pago || "pago";
  } catch (error) {
    console.log("no se encontró archivo .json para facturar");
    return gotoFlow(flowBack);
  }
  let message = []; // Arreglo para ordenar toda la factura del cliente

  message.push("--- *Detalles del pedido* ---");
  message.push("\n*Pizza(s):* 🍕🍕");

  for (const pizzaId in pizzas) {
    // recorre las pizzas
    const pizza = pizzas[pizzaId];
    totalPizzas = totalPizzas + pizza.precio;
    if (pizza.extraVez > 0) {
      message.push(
        `* *Pizza ${pizza.tipo}* (${pizza.tamano}) - Cantidad: ${pizza.cantidad} = Precio: *$${pizza.precio}*`
      );
      for (const extraId in pizzas[pizzaId].extra) {
        const extra = pizzas[pizzaId].extra[extraId];
        totalExtras = totalExtras + extra.precio;
        message.push(
          `       *+* Extra de ${extra.tipo} - Cantidad: ${extra.cantidad} = Precio: *$${extra.precio}*`
        );
      }
    } else {
      message.push(
        `* *Pizza ${pizza.tipo}* (${pizza.tamano}) - Cantidad: ${pizza.cantidad} = Precio: *$${pizza.precio}*`
      );
    }
  }
  message.push(
    `*Total en Pizzas(s): $${(totalPizzas + totalExtras).toFixed(2)}* 🍕`
  );

  if (jsonData.bebidaVez > 0) {
    // verifica si existen y luego recorre las bebidas
    message.push("\n*Bebida(s):* 🥤🥤");
    for (const bebidaId in bebidas) {
      const bebida = bebidas[bebidaId];
      totalBebidas = totalBebidas + bebida.precio;
      message.push(
        `* Refresco ${bebida.tipo} - Cantidad: ${bebida.cantidad} = Precio: *$${bebida.precio}*`
      );
    }
    message.push(`*Total Bebidas(s): $${totalBebidas.toFixed(2)}* 🥤`);
  }

  if (jsonData.postreVez > 0) {
    // verifica si existen y luego recorre las bebidas
    message.push("\n*Postre(s):* 🍰🍪");
    for (const postreId in postres) {
      const postre = postres[postreId];
      totalPostres = totalPostres + postre.precio;
      message.push(
        `* ${postre.tipo} - Cantidad: ${postre.cantidad} = Precio: *$${postre.precio}*`
      );
    }
    message.push(`*Total en postres(s): $${totalPostres.toFixed(2)}* 🍰`);
  }

  if (pago.length == 4 && metodoEntrega.length == 4) {
    total = (totalPizzas + totalBebidas + totalPostres + totalExtras).toFixed(
      2
    );
    message.push(`\n --- *Sub-Total: $${total}* ---`);
  } else if (pago.length >= 7 && metodoEntrega.length >= 6) {
    // MÉTODO DE PAGO EXISTENTE
    if (metodoEntrega == "delivery") {
      totalDelivery = 1.0;
      message.push(`\n* Servicio de Delivery: *$${totalDelivery}* 🛵`);
    } else if (metodoEntrega == "pickUp") {
      message.push(`\n* Retiro en tienda (sin costos adicionales) 🏬`);
    }
    message.push(`* Método de pago: *${pago}* 💳`);
    total = (
      totalPizzas +
      totalBebidas +
      totalPostres +
      totalDelivery +
      totalExtras
    ).toFixed(2);
    saveTotal(ctx.from, total);
    message.push(`\n --- *Total: $${total}* ---`);
  } else if (pago.length == 4 && metodoEntrega.length >= 6) {
    if (metodoEntrega == "delivery") {
      totalDelivery = 1.0;
      message.push(`\n* Servicio de Delivery: *$${totalDelivery}* 🛵`);
      total = (
        totalPizzas +
        totalBebidas +
        totalPostres +
        totalDelivery +
        totalExtras
      ).toFixed(2);
      saveTotal(ctx.from, total);
      message.push(`\n --- *Total: $${total}* ---`);
    } else if (metodoEntrega == "pickUp") {
      message.push(`\n* Retiro en tienda (sin costos adicionales) 🏬`);
      total = (totalPizzas + totalBebidas + totalPostres + totalExtras).toFixed(
        2
      );
      saveTotal(ctx.from, total);
      message.push(`\n --- *Total: $${total}* ---`);
    }
  }
  await flowDynamic(message.join("\n"));
  return gotoFlow(flowFacturaMenu);
});
