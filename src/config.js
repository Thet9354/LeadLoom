// Central config for API base URL
// Uses VITE_API_URL from .env, defaults to localhost for local dev
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
