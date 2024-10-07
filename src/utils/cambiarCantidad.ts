import { readFileSync } from "~/services";
import { guardarBebida, guardarExtra, guardarPostre, saveUserOrder } from "~/utils"

export const cambiarCantidad = (phoneUser:string,newAmount:number) => {
    const amount = newAmount
    let position = 0
    let positionForExtra = 0
    let tipo = ''
    let cantidad = 0
    let initPrice = 0
    let changeData:any = {}
    let type = '' 
    try { // Intenta leer el archivo .json
        const data = readFileSync(`./src/data/users/${phoneUser}.json`, 'utf8');
        const jsonData = JSON.parse(data) // Accede a las propiedades relevantes
        changeData = jsonData.changeData
        type = changeData.tipo
        position = changeData.ubicacion
        positionForExtra = changeData?.ubicacionDelExtra || 0
        tipo = changeData.seleccion.tipo
        cantidad = changeData.seleccion.cantidad
        initPrice = changeData.seleccion.precio/cantidad
    } catch (error) { // En caso de error
       console.error('Error en función cambiarCantidad(): '+error)
    }   
    const price = initPrice*amount
    switch(type){
        case 'pizza':
            const pizzaSize = changeData.seleccion.tamano
            saveUserOrder(phoneUser,tipo,pizzaSize,price,amount,position,null,null,'changePrice')
            // if(amount==1){
            //     return `✅ Ahora tienes ${amount} pizza 🍕 ${tipo} ${pizzaSize} con un valor de *$${price.toFixed(2)}*`
            // }else if(tipo=='mediterránea'||tipo=='napolitana'){
            //     return `✅ Ahora tienes ${amount} pizzas 🍕 ${tipo}s ${pizzaSize}s dando un valor de *$${price.toFixed(2)}*`
            // }else{
            //     return `✅ Ahora tienes ${amount} pizzas 🍕 ${tipo} ${pizzaSize}s dando un valor de *$${price.toFixed(2)}*`
            // } 
            break;

        case 'bebida':
            guardarBebida(phoneUser, tipo,price, amount, position,'change')
            // if(amount==1){
            //     return `✅ Ahora tienes ${amount} refresco 🥤 ${tipo} con un valor de *$${price.toFixed(2)}*`
            // }else{
            //     return `✅ Ahora tienes ${amount} refrescos 🥤 ${tipo} dando un valor de *$${price.toFixed(2)}*`
            // }
            break;

        case 'postre':
            guardarPostre(phoneUser, tipo,price, amount, position,'change')
                // return `✅ Ahora tienes ${amount} ${tipo} dando un valor de *$${(price.toFixed(2))}*`
            break; 

        case 'extra':
            guardarExtra(phoneUser,type,price,amount,position,positionForExtra,'change')
        
    }
    return;
}