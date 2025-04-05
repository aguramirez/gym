// src/config/api.config.ts
const apiUrl = import.meta.env.VITE_API_URL || 'https://gracious-intuition-production.up.railway.app';
console.log('API URL que se está utilizando:', apiUrl);

export const config = {
  API_URL: apiUrl,
  AUTH_ENDPOINT: `${apiUrl}/auth`,
  CLIENTES_ENDPOINT: `${apiUrl}/clientes`,
  EJERCICIOS_ENDPOINT: `${apiUrl}/ejercicios`,
  RUTINAS_ENDPOINT: `${apiUrl}/rutinas`,
  CLIENTE_RUTINAS_ENDPOINT: `${apiUrl}/cliente-rutinas`,
};

export default config;