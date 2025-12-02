import React, { useState } from "react";
import { RiMailFill, RiLockFill, RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loginAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos", { duration: 3000 });
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Iniciando login con:', email);
      const result = await authService.login(email.toLowerCase().trim(), password);
      console.log('✅ Login exitoso:', result);
      
      if (result.user && result.jwt) {
        // El JWT ya fue guardado en authService.login()
        // Ahora establecer el usuario en el store
        loginAuth(result.user);
        console.log('👤 Usuario establecido en store:', result.user);
        toast.success(`¡Bienvenido ${result.user.name}!`, { duration: 2000 });
        setTimeout(() => navigate("/dashboard"), 2100);
      }
    } catch (error) {
      const errorMessage = error.detail || "Error al iniciar sesión";
      toast.error(errorMessage, { duration: 3000 });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
          Iniciar <span className="text-primary">Sesion</span>
        </h1>
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="email"
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-8">
            <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type={showPassword ? "text" : "password"}
              className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <RiEyeOffFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer"
              />
            ) : (
              <RiEyeFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer"
              />
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4 items-center">
          <Link
            to="/olvide-password"
            className="hover:text-primary transition-colors"
          >
            Olvidaste tu Contraseña?
          </Link>
          <span className="flex items-center gap-2">
            No tienes cuenta?
            <Link
              to="/registro"
              className="text-primary hover:text-gray-100 transition-colors"
            >
              Registrate
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;