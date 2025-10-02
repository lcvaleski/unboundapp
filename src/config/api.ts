// API Configuration
const ENV = __DEV__ ? 'development' : 'production';

const API_URLS = {
  development: 'http://localhost:3000',
  // Update this URL after deploying to Render
  production: 'https://unbound-backend-3cz6.onrender.com',
};

export const API_URL = API_URLS[ENV];

export const ENDPOINTS = {
  transcribe: `${API_URL}/transcribe`,
  translate: `${API_URL}/translate`,
  health: `${API_URL}/health`,
};