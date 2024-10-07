import { guardarExtra } from "./guardarExtra";

export function saveExtra(
    phoneNumber:string,
    extraSelectType:string,
    extraSelectPrice:number,
    pizzaVez:number,
    extraVez:number,
    extraTipo:string,
    extraCantidad:number,
    pizzaTipo:string,
    pizzaCantidad:number,
    ){
        
    if(extraVez==0){
        guardarExtra(phoneNumber,extraSelectType,extraSelectPrice,1,1,pizzaVez)
        return(`* Añadió para su pizza ${pizzaTipo} un extra de ${extraSelectType} con un valor de *$${(extraSelectPrice).toFixed(2)}*`)

    }else if(extraVez>=1){
        // if(extraTipo==extraSelectType||extraTipoAnterior==extraSelectType||extraTipoLast==extraSelectType){ //mejorar con un FOR
        if(extraTipo==extraSelectType){
            if(pizzaCantidad>extraCantidad){
                guardarExtra(phoneNumber,extraSelectType,extraSelectPrice*(extraCantidad+1),extraCantidad+1,extraVez,pizzaVez,'add')
                return(`* +${extraCantidad+1} extras de ${extraSelectType} y lleva un valor de *$${(extraSelectPrice*(extraCantidad+1)).toFixed(2)}*`)

            }else if(pizzaCantidad>1){
                return(`* Sus ${pizzaCantidad} pizzas ${pizzaTipo} ya tienen extra de ${extraSelectType} (un extra por cada pizza)`)

            }else{
                return(`* Su pizza ${pizzaTipo} ya tiene extra de ${extraSelectType} (un extra por cada pizza)`)

            }
            
        }else if(pizzaCantidad>1){
            guardarExtra(phoneNumber,extraSelectType,extraSelectPrice,1,extraVez+1,pizzaVez)
            return(`* Agregó a una de sus pizzas ${pizzaTipo} un extra de ${extraSelectType} con un valor de *$${(extraSelectPrice).toFixed(2)}*`)

        }else{
            guardarExtra(phoneNumber,extraSelectType,extraSelectPrice,1,extraVez+1,pizzaVez)
            return(`* Agregó a su pizza ${pizzaTipo} un extra de ${extraSelectType} con un valor de *$${(extraSelectPrice).toFixed(2)}*`)

        }
    }
}