import { existsSync, readFileSync, writeFileSync } from "~/services";
import { getChangeData } from "~/utils";

export function guardarPostre(number:string, type:string, price:number, amount:number, time:number,ACTION?:string) {
    let postre = { tipo: type, precio: price, cantidad: amount };
    try {
        const filePath = `./src/data/users/${number}.json`;

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
            console.error(`El archivo ${number}.json no existe.`);
            return;
        }

        // Leer datos existentes
        const data = readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(data);

        // Inicializar la propiedad 'bebida' si no existe
        existingData.postre = existingData.postre || {};

        // Agregar nuevos datos
        if(ACTION!='change'){
            existingData.postreVez = time;
        }
        existingData.postre[time] = { tipo: type, precio: price, cantidad: amount };
        getChangeData(number,'dataEntry',postre,time,false,'postre')
        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Datos agregados correctamente al archivo ${number}.json`);
        return;
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
    }
}