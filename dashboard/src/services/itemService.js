import api from './api';

export const itemService = {
    // Obtener todos los items
    getAll: async () => {
        try {
            const response = await api.get('/items');
            return response.data;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error.response?.data || { detail: 'Error al obtener productos' };
        }
    },

    // Obtener un item por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/items/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al obtener producto' };
        }
    },

    // Obtener items por categoría
    getByCategory: async (categoryId) => {
        try {
            const response = await api.get(`/items/by-category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al obtener productos por categoría' };
        }
    },

    // Crear nuevo item
    create: async (itemData) => {
        try {
            const response = await api.post('/items', {
                name: itemData.name,
                description: itemData.description || '',
                quantity: itemData.quantity,
                price: itemData.price,
                categoryId: itemData.categoryId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al crear producto' };
        }
    },

    // Actualizar item
    update: async (id, itemData) => {
        try {
            const response = await api.put(`/items/${id}`, {
                name: itemData.name,
                description: itemData.description,
                quantity: itemData.quantity,
                price: itemData.price,
                categoryId: itemData.categoryId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al actualizar producto' };
        }
    },

    // Eliminar item
    delete: async (id) => {
        try {
            const response = await api.delete(`/items/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al eliminar producto' };
        }
    },
};
