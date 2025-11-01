import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Profile from "./pages/admin/Profile";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: '8px',
            background: '#1f2937',
            color: '#facc15',
          },
          iconTheme: {
            primary: '#facc15',
            secondary: '#1f2937',
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