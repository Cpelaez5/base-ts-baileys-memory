export function extractFirstName(wsName:string) { // Extrae primer nombre de una persona
    const wsNameParts = wsName.split(' ');
    const wsFirstName = wsNameParts[0];
    return wsFirstName;
}
