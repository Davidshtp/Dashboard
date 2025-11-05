import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Profile from "./pages/admin/Profile";
import Dashboard from "./pages/admin/Dashboard";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./components/ProtectedRoute"; 

import Inventory from "./pages/admin/Inventory";
import Categories from "./pages/admin/Categories"; 

function App() {
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

      <BrowserRouter>
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
            <Route path="perfil" element={<Profile />} />
          </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;