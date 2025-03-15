import { google } from 'googleapis';
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.GoogleAuth({
    keyFile: 'google-key.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const spreadsheetId = process.env.SPREADSHEET_ID;

export async function appendToSheet(data: string[][]) {
    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'A1';
    const valueInputOption = 'USER_ENTERED';
    const resource = {
        values: data,
    };
    
    try {

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            requestBody: resource,
        });
        
        return response;
        
    } catch (error) {
        console.error('Error al escribir en la hoja de cálculo:', error);
        return "Lo siento, hubo un error al procesar tu solicitud.";
    }
}

export async function readSheet(range: string) {
    const sheets = google.sheets({ version: 'v4', auth });
    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        
        return response.data.values;
        
    } catch (error) {
        console.error('Error al leer la hoja de cálculo:', error);
        return "Lo siento, hubo un error al procesar tu solicitud.";
    }
}
