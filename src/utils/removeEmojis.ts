export function removeEmojis(text:string) {
    let string = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
    if (/^[0-9]/.test(string)){
       return (string.slice(4)).trim()
    }else{
        return (string.slice(2)).trim()
    }
}