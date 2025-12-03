import api from './api';

export const profileService = {
    // Obtener perfil del usuario
    getProfile: async (userId) => {
        try {
            const response = await api.get(`/profile/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al obtener perfil' };
        }
    },

    // Actualizar perfil (nombre, apellido, avatar)
    updateProfile: async (userId, { name, lastName, avatar }) => {
        try {
            const response = await api.put(`/profile/${userId}`, {
                name,
                lastName,
                avatar
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al actualizar perfil' };
        }
    },

    // Cambiar email
    updateEmail: async (userId, newEmail) => {
        try {
            const response = await api.put(`/profile/${userId}/email`, {
                newEmail
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al cambiar email' };
        }
    },

    // Cambiar contraseña
    changePassword: async (userId, currentPassword, newPassword) => {
        try {
            const response = await api.put(`/profile/${userId}/password`, {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al cambiar contraseña' };
        }
    },
};
