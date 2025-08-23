import createFetchClient from 'openapi-fetch';
import * as scheduleBuilderTypes from './types';
import { BASE_API_URL } from '../lib/constants';

export { scheduleBuilderTypes };

export const scheduleBuilderFetch =
  createFetchClient<scheduleBuilderTypes.paths>({
    baseUrl: BASE_API_URL,
  });
