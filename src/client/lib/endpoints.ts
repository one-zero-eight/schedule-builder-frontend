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

  try {
    onStatusChange('Fetching collisions...');
    const { response, data } = await scheduleBuilderFetch.POST(
      '/collisions/check',
      {
        body: {
          google_spreadsheet_id: spreadsheetID,
          // TODO: Make this configurable in settings
          target_sheet_names: ['1st block common (since 25/08)', 'Ru Programs'],
          check_room_collisions: true,
          check_teacher_collisions: true,
          check_space_collisions: true,
          check_outlook_collisions: true,
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
