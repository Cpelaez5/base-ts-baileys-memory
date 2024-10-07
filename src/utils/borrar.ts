import { readFileSync, writeFileSync } from "~/services";

export const borrar = (phoneUser:string,position:number,typeProduct:string,positionForExtra?:number) => {
    try {
        const datos = readFileSync(`./src/data/users/${phoneUser}.json`, 'utf8');
        const data = JSON.parse(datos);
    
        switch(typeProduct){
            case 'pizza': {//🍕
                delete data.pizza[position];   // Eliminar la pizza segun posición
                const newPizza = {};  // Reorganizar las claves restantes
                let newKeyA = 1;
                for (const key in data.pizza) {
                    newPizza[newKeyA.toString()] = data.pizza[key];
                    newKeyA++;
                } 
                data.pizza = newPizza; // Asignar las claves reorganizadas al objeto pizza
                data.pizzaVez = newKeyA-1;
            break;
            }

            case 'bebida': {//🥤
                delete data.bebida[position];   // Eliminar la bebida segun posición
                const newBebida = {};  // Reorganizar las claves restantes
                let newKeyB = 1;
                for (const key in data.bebida) {
                    newBebida[newKeyB.toString()] = data.bebida[key];
                    newKeyB++;
                } 
                data.bebida = newBebida; // Asignar las claves reorganizadas al objeto bebida
                data.bebidaVez = newKeyB-1;
            break;
            }

            case 'postre': {//🧁
                delete data.postre[position];   // Elimina el postre segun posición
                const newPostre = {};  // Reorganizar las claves restantes
                let newKeyC = 1;
                for (const key in data.postre) {
                    newPostre[newKeyC.toString()] = data.postre[key];
                    newKeyC++;
                } 
                data.postre = newPostre; // Asignar las claves reorganizadas al objeto postre
                data.postreVez = data.postreVez-1;
            break;
            }

            case 'extra': {//🥓
                delete data.pizza[positionForExtra].extra[position];   // Elimina el extra segun posición
                const newExtra = {};  // Reorganizar las claves restantes
                let newKeyD = 1;
                for (const key in  data.pizza[positionForExtra].extra) {
                    newExtra[newKeyD.toString()] = data.pizza[positionForExtra].extra[key];
                    newKeyD++;
                } 
                data.pizza[positionForExtra].extra = newExtra; // Asignar las claves reorganizadas al objeto postre
                data.pizza[positionForExtra].extraVez = data.pizza[positionForExtra].extraVez-1;
            break;
            }
        } 

        data.changeData = { seleccion:{}, ubicacion: 0, ubicacionDelExtra: 0, activo: false, tipo: ''};
        writeFileSync(`./src/data/users/${phoneUser}.json`, JSON.stringify(data, null, 4)); // Guardar los cambios en el archivo JSON
        return '✅ ¡Producto borrado exitosamente!';

    } catch (err) {
        console.log('Error en borrar.ts:\n'+err);
        return;
    }
}