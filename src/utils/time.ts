export function time(){
    const ahora = new Date();
    const fechaNumerica = ahora.getFullYear() * 10000 + (ahora.getMonth() + 1) * 100 + ahora.getDate();
    const horaNumerica = ahora.getHours() * 10000 + ahora.getMinutes() * 100 + ahora.getSeconds();
    return(`${fechaNumerica}_${horaNumerica}`)
}