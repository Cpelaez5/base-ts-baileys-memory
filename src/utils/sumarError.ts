import { existsSync, readFileSync, writeFileSync } from "~/services";


export function sumarError(number:string) {
    try {
        const filePath = `./src/data/users/${number}.json`;

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
            console.error(`function sumarError(): El archivo ${number}.json no existe.`);
            return;
        }

        // Leer datos existentes
        const data = readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(data);

        // Inicializar la propiedad 'error' si no existe,
        existingData.error = existingData.error || 0;

        // Sumar si existe el error
        existingData.error++
        console.log('cuenta de error ==',existingData.error)

        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`error sumado correctamente en ${number}.json`);
        return;
    } catch (error) {
        console.error(`Error al sumar error en ${number}.json`);
    }
}