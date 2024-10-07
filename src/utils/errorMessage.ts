import { leerError, sumarError } from "~/utils";

export function errorMessage(wsFirstName:string,responseCode:string,phoneNumber:string){// Regresa un mensaje de error aleatorio con el nombre del usuario
    
    const wordsError = 
        {'1':[
        `¡Ops! 😯 No entendí lo que quisiste decir, ${wsFirstName} 😓 ¿Podrías repetirlo? 🙏`,
        `¡Vaya! 😮 Parece que no capté tu mensaje, ${wsFirstName} 😕 ¿Te importaría decirlo de nuevo? 🙏`,
        `¡Ay! 😵 No logré entender bien eso, ${wsFirstName} 😧 ¿Puedes intentarlo una vez más? 🙏`,
        `¡Uy! 😳 Tu mensaje me confundió, ${wsFirstName} 😟 ¿Serías tan amable de repetirlo? 🙏`,
        `¡Huy! 😲 Me perdí un poco ahí, ${wsFirstName} 😬 ¿Podrías decirlo otra vez? 🙏`], 
        '2':[
        `¡Ups! Parece que algo salió mal. Por favor, inténtalo nuevamente. 🙃`,
        `¡Vaya! Algo no funcionó como se esperaba. ¿Podrías intentarlo de nuevo? 🤔`,
        `Error inesperado. Por favor, vuelve a intentarlo. 😅`,
        `Parece que hubo un pequeño tropiezo. Reinténtalo, ¡seguro que esta vez funciona! 🚀`,
        `Oops, parece que algo se cruzó en el camino. ¿Podrías intentarlo nuevamente? 🙌`],
        '3':[
        `¡Ops! No entendí lo que quisiste decir 😓 ¿Podrías repetirlo? 🙏`,
        `¡Vaya! No capté tu mensaje 😕 ¿Te importaría decirlo de nuevo? 🙏`,
        `¡Ay! No logré entender bien eso 😧 ¿Puedes intentarlo una vez más? 🙏`,
        `¡Uy! Tu mensaje me confundió 😟 ¿Serías tan amable de repetirlo? 🙏`,
        `¡Huy! Me perdí un poco ahí 😬 ¿Podrías decirlo otra vez? 🙏`],
        '4': [
        "Lamentamos informarte que aún estamos trabajando en esta función ⚙️🛠️. Por favor, selecciona otra opción",
        "Estamos en proceso de implementación de esta característica ⚙️ ¿Podrías elegir otra opción?",
        "Actualmente estamos trabajando en esta función 🛠️⚙️. Por favor, elige otra opción.",
        "Nos encontramos desarrollando esta función 👨‍💻⚙️. Por favor, selecciona otra opción.",
        "Esta función está en construcción 🛠️. Por favor, selecciona otra opción."],
        '5': [
            'Parece que hubo un problema al consultar los datos... Vamos a volverlo a intentar 🚀'
        ]}
        const randomWord = wordsError[responseCode][Math.floor(Math.random() * 5)]
        if(phoneNumber != null){
            if(leerError(phoneNumber)>=4){
                sumarError(phoneNumber)
                return '¡Vaya! 😮 Parece que has alcanzado el límite de errores'
            }else{
                sumarError(phoneNumber)
                return randomWord;
            }
        }else{
            
            return randomWord;
        }
}