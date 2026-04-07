import { AI_API_URL } from '../app/config/api-config';

export const environment = {
  production: true,
  baseUrl: `${window.location.protocol}//${window.location.hostname}/portfolio/`,
  aiApiUrl: AI_API_URL,
  web3FormsAccessKey: ''
};
