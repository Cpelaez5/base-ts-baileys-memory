import { guardarPostre } from "./guardarPostre"

export function saveSweet(
    phoneNumber:string,
    postre:string,
    precio:number,
    postreVez:number,
    postreTipo:string,
    productAmount:any,
){
    if(postreVez==0){ // Si el usuario no ha pedido postre
        guardarPostre(phoneNumber,postre,precio,1,1)

        if((postre.includes('Galletas'))||(postre.includes('Mini'))){
            return(`* Unas ${postre} con un valor de *$${(precio).toFixed(2)}*`)

        }else{
            return(`* Usted pidió una ${postre} con un valor de *$${(precio).toFixed(2)}*`)

        }
    }else if(postreVez>=1){ // si ya tiene postre añadido
        if(postreTipo==postre){ // Verifica si el postre seleccionado es igual al postre añadido anteriormente para solo sumar la cantidad
            guardarPostre(phoneNumber,postre,precio*(productAmount+1),productAmount+1,postreVez,'change')
            return(`* +${productAmount+1} ${postre} sumando un valor de *$${((precio*(productAmount+1)).toFixed(2))}*`)

        }else{
        guardarPostre(phoneNumber,postre,precio,1,postreVez+1)

            if(postre.includes('Galletas')||postre.includes('Donas')){
                return(`* Unas ${postre} con un valor de *$${(precio).toFixed(2)}*`)

            }else{
                return(`* Una ${postre} con un valor de *$${(precio).toFixed(2)}*`)

            }
        }
    } 
}