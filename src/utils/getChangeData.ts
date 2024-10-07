import { readFile, writeFile } from "~/services";

export function getChangeData(
    number:string,
    ACTION:string,
    object?:any,
    ubication?:number,
    boolean?:boolean,
    type?:string,
    ubicationForExtra?:number
){ //ACTION => 'on' || 'off' || 'dataEntry' || 'delete'
    readFile(`./src/data/users/${number}.json`, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
    
        // Parsear los datos existentes
        console.log(JSON.parse(data));
        const existingData = JSON.parse(data);
    
        switch(ACTION){

            case 'on':
                existingData.changeData = { seleccion: existingData.changeData.seleccion,
                    ubicacion: existingData.changeData.ubicacion,
                    ubicacionDelExtra: existingData.changeData.ubicacionDelExtra,
                    activo: true, 
                    tipo: existingData.changeData.tipo};
            break;

            case 'off':
                existingData.changeData = { seleccion: existingData.changeData.seleccion,
                    ubicacion: existingData.changeData.ubicacion,
                    ubicacionDelExtra: existingData.changeData.ubicacionDelExtra,
                    activo: false, 
                    tipo: existingData.changeData.tipo};
            break;

            case 'dataEntry':
                    existingData.changeData = {
                        seleccion: object,
                        ubicacion: ubication,
                        ubicacionDelExtra: ubicationForExtra,
                        activo: boolean,
                        tipo: type
                    };
            break;

            case 'delete':
                existingData.changeData = { seleccion: {}, ubicacion: 0, ubicacionDelExtra: 0, activo: false, tipo: ''};
            break;    
        }
    
        // Escribir los datos actualizados en el archivo
        writeFile(`./src/data/users/${number}.json`, JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return;
            }
            console.log(`Datos agregados correctamente al archivo ${number}.json`);
        });
    });

}