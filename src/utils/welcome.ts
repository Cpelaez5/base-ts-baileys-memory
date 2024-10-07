import { checkTrue } from "./checkTrue";

export function welcome(wsFirstName:string, message:string, string:string) {
  // Saluda al usuario segun lo que haya dicho
  const wordsDay = [
    "día",
    "días",
    "dia",
    "dias",
    "Día",
    "Dia",
    "DIA",
    "DÍA",
    "Días",
    "Dias",
    "DIAS",
    "DÍAS",
  ];
  const wordsAfter = ["Tarde", "TARDE", "tarde", "tARDE"];
  const wordsNight = ["Noche", "noche", "NOCHE", "nOCHE"];
  const wordsSalut = ["Saludo", "saludo", "SALUDO", "sALUDO"];

  if (checkTrue(wordsAfter, message)) {
    if (wsFirstName == "") {
      return `¡Hola, feliz tarde! 🌤️🙌 Te damos la bienvenida a *${string}* 🍕`;
    } else {
      return `¡Hola, feliz tarde 🌤️ ${wsFirstName}! 🙌 Te damos la bienvenida nuevamente a *${string}* 🍕`;
    }
  } else if (checkTrue(wordsDay, message)) {
    if (wsFirstName == "") {
      return `¡Hola, feliz día! 🌅🙌 Te damos la bienvenida a *${string}* 🍕`;
    } else {
      return `¡Hola, feliz día 🌅 ${wsFirstName}! 🙌 Te damos la bienvenida nuevamente a *${string}* 🍕`;
    }
  } else if (checkTrue(wordsNight, message)) {
    if (wsFirstName == "") {
      return `¡Hola, feliz noche! 🌃🙌 Te damos la bienvenida a *${string}* 🍕`;
    } else {
      return `¡Hola, feliz noche 🌃 ${wsFirstName}! 🙌 Te damos la bienvenida nuevamente a *${string}* 🍕`;
    }
  } else if (checkTrue(wordsSalut, message)) {
    if (wsFirstName == "") {
      return `¡Saludos! 🙌 Te damos la bienvenida a *${string}* 🍕`;
    } else {
      return `¡Saludos ${wsFirstName}! 🙌 Te damos la bienvenida nuevamente a *${string}* 🍕`;
    }
  } else {
    if (wsFirstName == "") {
      return `¡Hola! 🙌 Te damos la bienvenida a *${string}* 🍕`;
    } else {
      return `¡Hola, ${wsFirstName}! 🙌 Te damos la bienvenida nuevamente a *${string}* 🍕`;
    }
  }
}
