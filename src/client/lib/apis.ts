import { API_TOKEN_INVALID_HTTP_STATUS } from './constants';
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
        if (response.status === API_TOKEN_INVALID_HTTP_STATUS) {
          return { success: false, error: "The API token you provided is wrong" };
        }

        return { success: false, error: `Backend sent ${response.status} status code =(` }
      }

      const data: ConflictResponse = await response.json();
      return { success: true, payload: data};
    } catch (error) {
      console.error('Error getting collisions:', error);
      return { success: false, error: "Something went wrong with the request" }
    }
}