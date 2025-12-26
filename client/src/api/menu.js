import api from './axios';

export const getMenus = async () => {
    return await api.get('/menus/');
};

export const getMenuByCode = async (code) => {
    return await api.get(`/menus/${code}`);
};

export const createMenu = async (data) => {
    return await api.post('/menus/', data);
};

export const updateMenu = async (id, data) => {
    return await api.put(`/menus/${id}`, data);
};

export const deleteMenu = async (id) => {
    return await api.delete(`/menus/${id}`);
};

export const updateMenuItems = async (menuId, items) => {
    return await api.post(`/menus/${menuId}/items`, items);
};
