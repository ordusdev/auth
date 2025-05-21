import axios from 'axios';
import { KeycloakConstants } from './constants/keycloak.constant';

const api = axios.create({
  baseURL: KeycloakConstants.URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
