import api from './api';

export const categoryService = {
    // Obtener todas las categorías
    getAll: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error.response?.data || { detail: 'Error al obtener categorías' };
        }
    },

    // Obtener una categoría por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al obtener categoría' };
        }
    },

    // Crear nueva categoría
    create: async (name) => {
        try {
            const response = await api.post('/categories', { name });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al crear categoría' };
        }
    },

    // Actualizar categoría
    update: async (id, name) => {
        try {
            const response = await api.put(`/categories/${id}`, { name });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al actualizar categoría' };
        }
    },

    // Eliminar categoría
    delete: async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al eliminar categoría' };
        }
    },
};
