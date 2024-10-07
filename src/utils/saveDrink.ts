import { guardarBebida } from "./guardarBebida"

export function saveDrink(
    phoneNumber:string,
    bebidaSelect:string,
    bebidaSltPrice:number,
    bebidaVez:number,
    bebidaTipo:string,
    bebidaCantidad:number
){
    if(bebidaVez==0){
        guardarBebida(phoneNumber,bebidaSelect,bebidaSltPrice,1,1)
         return(`* Un refresco ${bebidaSelect} con un valor de *$${(bebidaSltPrice).toFixed(2)}*`)

    }else if(bebidaVez>=1){
        if(bebidaTipo==bebidaSelect){
            guardarBebida(phoneNumber,bebidaSelect,(bebidaSltPrice*(bebidaCantidad+1)),bebidaCantidad+1,bebidaVez,'change')
             return(`* +${bebidaCantidad+1} refrescos ${bebidaSelect} sumando un valor de *$${(bebidaSltPrice*(bebidaCantidad+1)).toFixed(2)}*`)

        }else{
        guardarBebida(phoneNumber,bebidaSelect,bebidaSltPrice,1,bebidaVez+1)
         return(`* Un refresco ${bebidaSelect} con un valor de *$${(bebidaSltPrice).toFixed(2)}*`)
         
        }
    }
}