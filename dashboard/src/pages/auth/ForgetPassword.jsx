import React, { useState } from "react";
import { RiMailFill, RiLockFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { toast } from "react-hot-toast";
import emailjs from "emailjs-com";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1 = enviar email, 2 = verificar código
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Enviar código de recuperación
  const sendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Ingresa tu correo");

    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      
      if (result) {
        // El backend genera y devuelve el código
        const resetCode = result.message.split(": ")[1]; // Extrae el código del mensaje
        
        // Enviar email con EmailJS
        await emailjs.send(
          "service_ze43zfw",
          "template_920y74a",
          {
            to_email: email,
            code: resetCode,
            name: email,
          },
          "haW95UnOS_PJcDWZy"
        );
        
        toast.success("Código enviado a tu correo", { duration: 2000 });
        setStep(2);
      }
    } catch (error) {
      const errorMessage = error.detail || "Error al solicitar recuperación";
      toast.error(errorMessage, { duration: 3000 });
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar código y cambiar contraseña
  const handleReset = async (e) => {
    e.preventDefault();

    if (!code.trim()) return toast.error("Ingresa el código");
    if (newPassword !== confirmPassword) return toast.error("Contraseñas no coinciden");
    if (newPassword.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");

    setLoading(true);

    try {
      const result = await authService.resetPassword(email, code, newPassword);
      
      if (result) {
        toast.success("Contraseña actualizada", { duration: 2000 });
        setTimeout(() => (window.location.href = "/"), 2000);
      }
    } catch (error) {
      const errorMessage = error.detail || "Error al restablecer contraseña";
      toast.error(errorMessage, { duration: 3000 });
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-full max-w-[450px] mx-auto">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
          Recuperar <span className="block text-primary">Contraseña</span>
        </h1>

        {step === 1 && (
          <form onSubmit={sendCode} className="mb-8">
            <div className="relative mb-8">
              <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className="mb-8">
            <div className="relative mb-4">
              <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
              <input
                type="text"
                placeholder="Código recibido"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
                required
              />
            </div>

            <div className="relative mb-4">
              <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
                required
              />
            </div>

            <div className="relative mb-8">
              <RiLockFill className="absolute top-1/2 -translate-y-1/2 left-2" />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-4 items-center">
          <span className="flex items-center justify-center gap-2">
            Ya tienes cuenta?
            <Link
              to="/"
              className="text-primary hover:text-gray-100 transition-colors"
            >
              Ingresa
            </Link>
          </span>
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

export default ForgetPassword;
