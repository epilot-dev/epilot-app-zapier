import OpenAPIClientAxios, { Document } from 'openapi-client-axios'
import definition from "./openapi.json";
import { Client } from './openapi';
import { config } from './config';

const api = new OpenAPIClientAxios({
  definition: definition as Document,
});

export const apiClient = api.initSync<Client>()
apiClient.defaults.baseURL = config.API_URL;
