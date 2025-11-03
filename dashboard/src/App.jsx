import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Profile from "./pages/admin/Profile";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./components/ProtectedRoute"; 

import Inventory from "./pages/admin/Inventory";
import Categories from "./pages/admin/Categories"; 

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={
          {
            /* ... (tu configuración de Toaster) ... */
          }
        }
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
            {/* 2. Agregar la nueva ruta aquí */}
            <Route path="inventario" element={<Inventory />} />
            <Route path="categorias" element={<Categories />} /> {/* <-- Añadimos la ruta */}
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