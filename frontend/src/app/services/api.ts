import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.0.6:3002', 
});

api.interceptors.request.use(config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
