import React, { useState } from "react";
import { RiMailFill, RiLockFill, RiEyeFill, RiEyeOffFill, RiUserLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { toast } from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mejoradas
    if (!form.name.trim() || !form.lastName.trim()) {
      toast.error("Nombre y apellido son requeridos", { duration: 3000 });
      return;
    }

    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres", { duration: 3000 });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden", { duration: 3000 });
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      if (result) {
        toast.success("Registrado correctamente", { duration: 2000 });
        setTimeout(() => navigate("/login"), 2100);
      }
    } catch (error) {
      const errorMessage = error.detail || "Error al registrar";
      toast.error(errorMessage, { duration: 3000 });
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
          Crear <span className="text-primary">Cuenta</span>
        </h1>
        <form className="mb-8" onSubmit={handleSubmit}>
          <button
            type="button"
            className="flex items-center justify-center py-3 px-4 gap-4 bg-secondary-900 w-full rounded-full mb-8 text-gray-100"
          >
            <img
              src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"
              className="w-4 h-4"
            />
            Registrate con Google
          </button>

          <div className="relative mb-4">
            <RiUserLine className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="text"
              name="name"
              placeholder="Nombre(s)"
              value={form.name}
              onChange={handleChange}
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              required
            />
          </div>

          <div className="relative mb-4">
            <RiUserLine className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              required
            />
          </div>

          <div className="relative mb-4">
            <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              required
            />
          </div>

          <div className="relative mb-4">
            <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
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

          <div className="relative mb-8">
            <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <span className="flex items-center justify-center gap-2">
          Ya tienes cuenta?
          <Link
            to="/"
            className="text-primary hover:text-gray-100 transition-colors"
          >
            Ingresa
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
