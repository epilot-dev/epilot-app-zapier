import OpenAPIClientAxios, { Document } from 'openapi-client-axios'
import definition from "./openapi.json";
import { Client } from './openapi';

const API_URL = import.meta.env.VITE_API_URL;

const api = new OpenAPIClientAxios({
  definition: definition as Document,
});

export const apiClient = api.initSync<Client>()
apiClient.defaults.baseURL = API_URL;
