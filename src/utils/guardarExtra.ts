import { existsSync, readFileSync, writeFileSync } from "~/services";

export function guardarExtra
(
    number:string,
    type:string,
    price:number,
    amount:number,
    time:number,
    pizzaId:number,
    ACTION?:string
)  
    {

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

        // Inicializar la propiedad 'extra' si no existe
        existingData.pizza[pizzaId].extra = existingData.pizza[pizzaId].extra || {};

        // Agregar nuevos datos
        if((ACTION=='change')||(ACTION=='add')){
            existingData.pizza[pizzaId].extraVez = existingData.pizza[pizzaId].extraVez;
        }else{
            existingData.pizza[pizzaId].extraVez = time
        }
        existingData.pizza[pizzaId].extra[time] = { tipo: type, precio: price, cantidad: amount };

        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Datos agregados correctamente al archivo ${number}.json`);

    } catch (error) {
        console.error('Error en guardarExtra.ts\n', error);
    }
}