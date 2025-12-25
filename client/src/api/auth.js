import api from './axios';

export const login = async (email, password) => {
    const response = await api.post('/auth/login/access-token', { username: email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateMe = async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};
