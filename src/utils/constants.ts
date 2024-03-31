export const getEnvironments = {
  production: 'production',
  development: 'development',
}
export const setEnvironmentURL = {
  [getEnvironments.production]: 'https://real-time-data-api.onrender.com',
  [getEnvironments.development]: 'http://localhost:5173',
}
