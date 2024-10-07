export const assignNumber = (number:number) => {
    if(number==10){
        return ('👉🔟 ');
    }else if(number>10){ 
        const idStr = number.toString()
        return (`👉${idStr[0]}\uFE0F\u20E3${idStr[1]}\uFE0F\u20E3 `);
    }else{
        return (`👉${number}\uFE0F\u20E3 `);
    }
}