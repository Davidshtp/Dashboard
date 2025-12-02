import api from './api';

export const authService = {
    // Registrar nuevo usuario
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', {
                name: userData.name,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al registrar' };
        }
    },

    // Iniciar sesión
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            // Guardar JWT en localStorage
            localStorage.setItem('auth-token', response.data.jwt || response.data.user.id);

            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al iniciar sesión' };
        }
    },

    // Obtener datos del usuario actual (validando JWT)
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                throw new Error('No hay token disponible');
            }

            // Llamar a /auth/me - el interceptor agrega el Bearer token automáticamente
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Solicitar código de recuperación
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al solicitar recuperación' };
        }
    },

    // Restablecer contraseña
    resetPassword: async (email, resetCode, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                email,
                resetCode,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Error al restablecer contraseña' };
        }
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('auth-token');
    },
};