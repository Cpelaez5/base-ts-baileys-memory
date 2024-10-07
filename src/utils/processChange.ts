import { removeEmojis } from "~/utils"

export const processChange = (string:string,type:string) => {
    const data = removeEmojis(string)
    const split = data.split(' - ')
    const product = split[0]

    let amount = parseInt(split[1].substring(10)) 
    let pricestr = split[2].split('*')
    let price = parseFloat(pricestr[1].substring(1))
    
    switch(type){
        case '\uD83C\uDF55': //🍕
            const pizzapr = product.split('(')
            const size = pizzapr[1].split(')*')
            return({
                tipo: pizzapr[0].substring(1).trim(),
                tamano: size[0],
                precio: price,
                cantidad: amount,
            })
        
        case '\uD83E\uDD64': //🥤
            return({ tipo: product, precio: price, cantidad: amount })  

        case '\uD83E\uDDC1': //🧁
            return({ tipo: product, precio: price, cantidad: amount })

        case '+': // +      
            return({ tipo: product.slice(4), precio: price, cantidad: amount })
    }
}