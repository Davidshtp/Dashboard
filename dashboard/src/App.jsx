import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useCallback, useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Profile from "./pages/admin/Profile";
import Dashboard from "./pages/admin/Dashboard";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { authService } from "./services/authService";
import Inventory from "./pages/admin/Inventory";
import Categories from "./pages/admin/Categories";
import LowStock from "./pages/admin/LowStock";

function AppContent() {
  const { setUser, logout, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error cargando usuario:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [setUser, logout]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#1E1F25',
            color: '#fff',
            border: '1px solid #374151',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: '#BDEB00',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-secondary-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-400 mt-4">Cargando sesión...</p>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/olvide-password" element={<ForgetPassword />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="categorias" element={<Categories />} />
            <Route path="stock-bajo" element={<LowStock />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;