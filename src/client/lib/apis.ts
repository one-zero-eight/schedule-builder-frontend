import { APIResponse, ConflictResponse } from './types';

const baseURL = 'https://api.andycodes.ru';

export async function getAllCollisions(spreadsheetID: string, token: string): Promise<APIResponse<ConflictResponse>> {
    const url = baseURL + '/collisions/check';
    const params = new URLSearchParams({
        google_spreadsheet_id: spreadsheetID
    });

    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return { success: false, error: `Backend sent ${response.status} status code =(` }
        }

        const data: ConflictResponse = await response.json();
        return { success: true, payload: data};
    } catch (error) {
        console.error('Error getting collisions:', error);
        return { success: false, error: "Something went wrong with the request" }
    }
}