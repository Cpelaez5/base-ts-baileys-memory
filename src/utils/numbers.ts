export const numbers = (string:string) => {
    const wordToNumber = {
        'uno': 1,
        'una': 1,
        'primer': 1,
        'dos': 2,
        'segund': 2,
        'tres': 3,
        'tercer': 3,
        'cuatro': 4,
        'cuart':4,
        'cinco': 5,
        'quint': 5,
        'seis': 6,
        'sext': 6,
        'siete': 7,
        'septim': 7,
        'séptim': 7,
        'ocho': 8,
        'nueve': 9,
        'diez': 10,
        'dies': 10,
        'once': 11,
        'doce': 12,
        'trece': 13,
        'catorce': 14
    };

    // const lowerCaseString = string.toLowerCase();
    for (const word in wordToNumber) {
        if (string.includes(word)) {
            return wordToNumber[word];
        }else{false}
    }
}