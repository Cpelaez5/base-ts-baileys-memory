export function checkTrue(array: any, message: string) {
  // Verifica si alguna palabra del array recibido SI esta en lo que envió el cliente
  const text = message.toLowerCase();
  if (array.some((keyword: any) => text.includes(keyword))) {
    return true;
  } else {
    return false;
  }
}
