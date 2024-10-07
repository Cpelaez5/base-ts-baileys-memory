import { readFileSync, writeFileSync } from "~/services";

export function saveName(number:string, name:string) {
    const path = `./src/data/users/${number}.json`;

    try {
        // Leer datos existentes
        const existingData = JSON.parse(readFileSync(path, 'utf8'));

        // Agregar nuevos datos
        existingData.nombre = name;

        // Escribir los datos actualizados en el archivo
        writeFileSync(path, JSON.stringify(existingData, null, 2));
        console.log(`Usuario nuevo registrado exitosamente en ${number}.json`);
        return;
    } catch (error) {
        console.error('Ha habido un error al registrar al nuevo usuario:', error.message);
    }
}