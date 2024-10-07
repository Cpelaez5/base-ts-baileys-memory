export const processEmoji = (string:string) =>{
    if(string.includes('\uD83C\uDF55')){
        return '\uD83C\uDF55'
    }else if(string.includes('\uD83E\uDD64')){
        return '\uD83E\uDD64'
    }else if(string.includes('\uD83E\uDDC1')){
        return '\uD83E\uDDC1'
    }else if(string.includes('+')){
        return '+'
    }
}