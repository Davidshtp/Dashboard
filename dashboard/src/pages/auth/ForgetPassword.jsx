import React, { useState } from "react";
import { RiMailFill, RiLockFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";
import emailjs from "emailjs-com";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1 = enviar email, 2 = verificar código
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const users = useUserStore((state) => state.users);
  const resetPassword = useUserStore((state) => state.resetPassword);
  const setResetCode = useUserStore((state) => state.setResetCode);
  const verifyResetCode = useUserStore((state) => state.verifyResetCode);
  const clearResetCode = useUserStore((state) => state.clearResetCode);

  // Enviar código de recuperación
  const sendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Ingresa tu correo");
    
    const userExists = users.find((u) => u.email === email);
    if (!userExists) return toast.error("Correo no registrado");

    // Generar código aleatorio de 6 dígitos
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código en el usuario
    setResetCode(email, tempCode);

    console.log(email,tempCode)

    try {
      await emailjs.send(
        "service_ze43zfw",
        "template_920y74a",
        {
          to_email: email,
          code: tempCode,
          name: email,
        },
        "haW95UnOS_PJcDWZy"
      );
      toast.success("Código enviado a tu correo", { duration: 2000 });
      setStep(2);
    } catch (error) {
      toast.error("Error enviando el correo");
      console.error(error);
    }
  };

  // Verificar código y cambiar contraseña
  const handleReset = (e) => {
    e.preventDefault();

    if (!verifyResetCode(email, code)) return toast.error("Código incorrecto");
    if (newPassword !== confirmPassword) return toast.error("Contraseñas no coinciden");

    const result = resetPassword(email, newPassword);
    if (result === "user-not-found") {
      toast.error("Usuario no encontrado");
    } else {
      toast.success("Contraseña actualizada", { duration: 2000 });
      clearResetCode(email);
      setTimeout(() => (window.location.href = "/"), 2000);
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
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
            >
              Enviar Código
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
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
            >
              Cambiar Contraseña
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
