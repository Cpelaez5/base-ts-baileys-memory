import { readFileSync } from "~/services";

export const isChange = (phoneUser:string) => {
    let objetoJSON: any = {}
    try {
        const datos = readFileSync(`./src/data/users/${phoneUser}.json`, 'utf8');
        objetoJSON = JSON.parse(datos);
        return objetoJSON.changeData.activo;
    } catch (err) {
        console.log('Error en isChange');
       return false;
    }
}