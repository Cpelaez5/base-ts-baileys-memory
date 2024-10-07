export function capitalice(cadena: string) {
  const primeraLetra = cadena.charAt(0).toUpperCase();
  const restoCadena = cadena.slice(1).toLowerCase();
  return primeraLetra + restoCadena;
}
