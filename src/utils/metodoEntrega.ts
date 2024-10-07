import { existsSync, readFileSync, writeFileSync } from "~/services";

export function metodoEntrega(phoneNumber:string,string:string) {
    try {
        const filePath = `./src/data/users/${phoneNumber}.json`;

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
            console.error(`El archivo ${phoneNumber}.json no existe.`);
            return;
        }

        // Leer datos existentes
        const data = readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(data);

        // Inicializar la propiedad 'entrega' si no existe
        existingData.entrega = existingData.entrega || '';

        // Agregar nuevos datos
        existingData.entrega = string;

        // Escribir los datos actualizados en el archivo
        writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Datos agregados correctamente al archivo ${phoneNumber}.json`);
        return;
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
    }
}