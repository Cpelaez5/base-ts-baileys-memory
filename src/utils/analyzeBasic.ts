import { numbers, processResponse } from "~/utils"


export const analyzeBasic = (string:string) => {

    const text = (string).toLowerCase()
    const containsLetters = /[a-zA-Z]/.test(text) // Verifica si la cadena contiene al menos una letra
    const containsNumbers = /\d/.test(text) // Verifica si la cadena contiene al menos un número

    if (containsLetters && containsNumbers) { // La cadena contiene tanto letras como números
        const nums = text.match(/\d+/g)
        if (nums.length>1){
            return false
        }else {
            return processResponse(text.match(/\d+/g)[0]);
        }
    } else if (containsLetters) { // La cadena contiene solo letras
        const data:any = numbers(text)
        if(data==false){
            return false
        }else{
            return data
        }

    } else if (containsNumbers) { // La cadena contiene solo números
        return processResponse(text.match(/\d+/g)[0]);

    } else { // La cadena no contiene ni letras ni números
        return false

    }
}