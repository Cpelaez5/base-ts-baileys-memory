import { readFile, writeFile } from "~/services";
import { time } from "./time";

export function finished(phoneNumber:string) {

    readFile(`./src/data/users/${phoneNumber}.json`, 'utf8', (err:any, data:any) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }

        // Parsear los datos existentes
        const existingData = JSON.parse(data);

        // Crear un nuevo nombre de archivo con marca de tiempo
        const timestamp = time();
        const newFilename = `./src/data/finished_sessions/${phoneNumber}_${timestamp}.json`;

        // Escribir los datos existentes en el nuevo archivo en un formato legible
        writeFile(newFilename, JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo json:', err);
                return;
            }
            console.log(`¡Sesión finalizada exitosamente! Datos guardados en ${newFilename}`);
            return;
        });
    });
}