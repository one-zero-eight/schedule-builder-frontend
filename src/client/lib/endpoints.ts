import { scheduleBuilderFetch } from '../api';
import * as scheduleBuilderTypes from '../api/types';
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

export async function getSemesterOptions(
  token: string
): Promise<
  APIResponse<scheduleBuilderTypes.SchemaSemesterOptionsOutput | null>
> {
  try {
    const { response, data } = await scheduleBuilderFetch.GET(
      '/options/semester',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok || data === undefined) {
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

    return { success: true, payload: data };
  } catch (error) {
    return { success: false, error: 'Something went wrong with the request' };
  }
}

export async function setSemesterOptions(
  semester: scheduleBuilderTypes.SchemaSemesterOptionsInput,
  token: string
): Promise<APIResponse<scheduleBuilderTypes.SchemaSemesterOptionsOutput>> {
  try {
    const { response, data } = await scheduleBuilderFetch.POST(
      '/options/set-semester',
      {
        body: semester,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok || data === undefined) {
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

    return { success: true, payload: data };
  } catch (error) {
    return { success: false, error: 'Something went wrong with the request' };
  }
}

export async function getTeachersOptions(
  token: string
): Promise<APIResponse<scheduleBuilderTypes.SchemaTeachersData | null>> {
  try {
    const { response, data } = await scheduleBuilderFetch.GET(
      '/options/teachers',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok || data === undefined) {
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

    return { success: true, payload: data };
  } catch (error) {
    return { success: false, error: 'Something went wrong with the request' };
  }
}

export async function setTeachersOptions(
  teachersData: string,
  token: string
): Promise<APIResponse<number>> {
  try {
    const { response, data } = await scheduleBuilderFetch.POST(
      '/options/set-teachers',
      {
        body: teachersData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/tab-separated-values',
        },
      }
    );

    if (!response.ok || data === undefined) {
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

    return { success: true, payload: data };
  } catch (error) {
    return { success: false, error: 'Something went wrong with the request' };
  }
}
