import { scheduleBuilderFetch } from '../api';
import { SchemaIssue } from '../api/types';
import { serverFunctions } from './serverFunctions';
import { APIResponse } from './types';

export default async function getAllCollisions(
  onStatusChange: (arg0: string) => void,
  token: string
): Promise<APIResponse<SchemaIssue[]>> {
  onStatusChange('Requesting spreadsheet ID...');
  const spreadsheetID = await serverFunctions.getSpreadsheetID();
  onStatusChange('Getting current sheet name...');
  const sheetName = await serverFunctions.getCurrentSheetName();

  try {
    onStatusChange('Fetching collisions...');
    const { response, data } = await scheduleBuilderFetch.GET(
      '/collisions/check',
      {
        params: {
          query: {
            google_spreadsheet_id: spreadsheetID,
            target_sheet_name: sheetName,
          },
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok || !data) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'The API token you provided is wrong',
        };
      }

      return {
        success: false,
        error: `Backend sent ${response.status} status code =(`,
      };
    }

    return { success: true, payload: data.issues };
  } catch (error) {
    return { success: false, error: 'Something went wrong with the request' };
  }
}
