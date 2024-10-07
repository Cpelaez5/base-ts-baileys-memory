import { readFile, writeFile } from "~/services";

export function eraseUserOrder(number: string){
    // Ruta al archivo JSON
const rutaArchivo = `./src/data/users/${number}.json`;

// Leer el archivo JSON
readFile(rutaArchivo, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo para borrar:', err);
    return;
  }

  // Parsear el contenido JSON
  const contenidoJSON = JSON.parse(data);

  // Modificar los valores (establecer todo a cero)
//   contenidoJSON.numero = '';
//   contenidoJSON.nombre = '';
  contenidoJSON.pizzaVez = 0;
  contenidoJSON.menuCode = 0;
  contenidoJSON.menuRespuesta = 0;
  contenidoJSON.pizza = {};
  contenidoJSON.bebida = {};
  contenidoJSON.postre = {};
  contenidoJSON.bebidaVez = 0;
  contenidoJSON.postreVez = 0;
  contenidoJSON.respuesta = 0;
  contenidoJSON.entrega = '';
  contenidoJSON.pago = '';
  contenidoJSON.ubicacion = '';
  contenidoJSON.total = 0;
  contenidoJSON.error = 0;


  // Convertir el objeto modificado a JSON
  const nuevoContenidoJSON = JSON.stringify(contenidoJSON, null, 2);

  // Guardar los cambios en el archivo
  writeFile(rutaArchivo, nuevoContenidoJSON, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar los cambios:', err);
      return;
    }
    console.log('Sesión finalizada exitosamente.');
    return;
  });
});
}