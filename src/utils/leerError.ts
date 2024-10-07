import { existsSync, readFileSync } from "~/services";

export function leerError(number:string) {
    try {
        const filePath = `./src/data/users/${number}.json`;

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
            console.error(`function leerError(): El archivo ${number}.json no existe.`);
            return;
        }

        // Leer datos existentes
        const data = readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(data);

        // Inicializar la propiedad 'error' si no existe,
        existingData.error = existingData.error || 0;

        // Leer si el usuario lleva 5 o más errores para colocar la cuenta en 0
        if(existingData.error==5){
            return existingData.error;
        }else{
            return existingData.error;
        }

    } catch (error) {
        console.error(`Error al leer errores en ${number}.json`);
        return;
    }
}