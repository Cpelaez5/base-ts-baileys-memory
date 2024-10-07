import { writeFileSync } from "~/services";

export function register(number:string) {
  const data = {
    numero: number,
    nombre: "",
    pizzaVez: 0,
    menuCode: 0,
    menuRespuesta: 0,
    pizza: {},
    bebida: {},
    postre: {},
    bebidaVez: 0,
    postreVez: 0,
    respuesta: 0,
    entrega: "",
    pago: "",
    ubicacion: "",
    total: 0,
    error: 0,
    changeData: {},
  };

  try {
    writeFileSync(`./src/data/users/${number}.json`, JSON.stringify(data));
    console.log(`Datos guardados correctamente en ${number}.json`);
    return;
  } catch (err) {
    console.error("Error en register() al crear y escribir los datos");
  }
}
