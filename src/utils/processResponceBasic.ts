export function processResponseBasic(string: string) {
    if(parseInt(string)>0){
        for (let i = 1; i <= 99; i++) {
            if (string.trim() === i.toString()) {
                return i;
            }
        }
    }
}