import { readFileSync } from "~/services";

export const getType = (phoneUser:string) => {
    let objetoJSON:any = {}
    try {
        const datos = readFileSync(`./src/data/users/${phoneUser}.json`, 'utf8');
        objetoJSON = JSON.parse(datos);
        return objetoJSON.changeData.tipo;
    } catch (err) {
        console.error('Error en getType');
       return false;
    }
}