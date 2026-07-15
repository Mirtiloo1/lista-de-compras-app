import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

let memoryToken: string | null = null;
const api = axios.create({
  baseURL: 'https://lista-de-compras-api-nytx.onrender.com',
  timeout: 10000,
})

api.interceptors.request.use(
  async (config) => {
    if (!memoryToken) {
      memoryToken = await SecureStore.getItemAsync('token');
    }

    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setApiToken = async (token: string) => {
  memoryToken = token;
  await SecureStore.setItemAsync('token', token);
};

export const clearApiToken = async () => {
  memoryToken = null; 
  await SecureStore.deleteItemAsync('token');
};

export default api