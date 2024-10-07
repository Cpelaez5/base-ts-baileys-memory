import { saveUserOrder } from "./saveUserOrder";

export function savePizza(
    phoneNumber:string,
    type:string,
    price:number,
    size:string,
    pizzaVez:number,
    pizzaTipo:string,
    pizzaTamano:string,
    pizzaCantidad:number,
    ){
        
    if(pizzaVez==0){ // volver función mas adelante
        saveUserOrder(phoneNumber,type,size,price,1,1,0,0)
        return(`* Una pizza 🍕 ${type} ${size} de *$${price}*`)

    }else if(pizzaVez>=1){
        if(pizzaTipo==type&&pizzaTamano==size){
            saveUserOrder(phoneNumber,type,size,price*(pizzaCantidad+1),pizzaCantidad+1,pizzaVez)

            if(type=='mediterránea'||type=='napolitana'){
                return(`* +${pizzaCantidad+1} pizzas 🍕 ${type}s ${size}s sumando un valor de *$${(price*(pizzaCantidad+1)).toFixed(2)}*`)

            }else{
                return(`* +${pizzaCantidad+1} pizzas 🍕 ${type} ${size}s sumando un valor de *$${(price*(pizzaCantidad+1)).toFixed(2)}*`)

            }

        }else{
            saveUserOrder(phoneNumber,type,size,price,1,pizzaVez+1)
            return(`* Una pizza 🍕 ${type} ${size} con un valor de *$${price}*`)

        }
    }  
}