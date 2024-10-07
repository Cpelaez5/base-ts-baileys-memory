import { existsSync, readFileSync, writeFileSync } from "~/services";

export function saveTotal(number:string,mount:any) {
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

        // Inicializar la propiedad 'entrega' si no existe
        existingData.total = existingData.total || 0;

        // Agregar nuevos datos
        existingData.total = parseFloat(mount);

        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Total agregado correctamente al usuario ${number}`);
        return;
    } catch (error) {
        console.error(`Error al procesar el Total del usuario ${number}`);
    }
}