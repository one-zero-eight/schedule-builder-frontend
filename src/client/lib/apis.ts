import { Collisions } from './types';

const baseURL = 'http://api.andycodes.ru:8000';

export async function getAllCollisions(spreadsheetID: string, token: string): Promise<Collisions> {
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
            throw new Error(`Got unexpected status code from backend: ${response.status}`);
        }

        const data: Collisions = await response.json();
        console.log("Success! Received all the collisions nicely")
        return data;
    } catch (error) {
        console.error('Error getting collisions:', error);
    }

    return []
}