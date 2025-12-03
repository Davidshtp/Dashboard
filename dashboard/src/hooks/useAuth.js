import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

// Hook personalizado para manejar la autenticación del usuario
export const useAuth = () => {
    const { setUser, logout } = useAuthStore();

    useEffect(() => {
        const loadCurrentUser = async () => {
            const token = localStorage.getItem('auth-token');

            if (!token) {
                return;
            }

            try {
                // Validar JWT y obtener datos del usuario desde el backend
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error cargando usuario:', error);
                logout();
            }
        };

        loadCurrentUser();
    }, []);
};

export default useAuth;
