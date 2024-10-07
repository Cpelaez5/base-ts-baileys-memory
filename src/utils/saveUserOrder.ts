import { existsSync, readFileSync, writeFileSync } from "~/services";
import { getChangeData } from "~/utils";

export function saveUserOrder(
    number:string,
    type:string,
    size:string,
    price:number,
    amount:number,
    time:number,
    bebida?:number,
    postre?:number,
    ACTION?:string){
    const pizza = {tipo: type,tamano: size,precio:price,cantidad:amount,
    }
    try {
        const filePath = `./src/data/users/${number}.json`;

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
            console.error(`Error en saveUserOrder()`);
            return;
        }

        // Leer datos existentes
        const data = readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(data);
        

        // Inicializar la propiedad 'pizza' y 'delivery' si no existe
        existingData.pizza = existingData.pizza || {};
        existingData.entrega = existingData.entrega || '';

        // Agregar nuevos datos
        if(ACTION!='changePrice'){
            existingData.pizzaVez = time;
        }
        // existingData.pizza[time] = {tipo: type , tamano: size , precio: price , cantidad: amount};
        if (existingData.pizza[time] && existingData.pizza[time].tipo === type && existingData.pizza[time].tamano === size) {
            // Actualizar solo la cantidad
            existingData.pizza[time].cantidad = amount;
            // if(ACTION=='changePrice'){
                existingData.pizza[time].precio = price;
            // }
        } else {
            // Crear una nueva pizza
            existingData.pizza[time] = {
                tipo: type,
                tamano: size,
                precio: price,
                cantidad: amount,
                extra: existingData.pizza[time]?.extra || {},
                extraVez: existingData.pizza[time]?.extraVez || 0,
            };
        }
        
        if(bebida<1&&bebida!=null){
            existingData.bebidaVez = bebida;
        }
        if(postre<1&&postre!=null){
            existingData.postreVez = postre;
        }
        
        getChangeData(number,'dataEntry',pizza,time,false,'pizza')
        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Datos agregados correctamente al archivo ${number}.json`);
        return;
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
    }
}
