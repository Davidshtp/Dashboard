import React from "react";
import { RiMailFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
    return (
<<<<<<< HEAD
        <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-full max-w-[450px] mx-auto">
=======
        <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-full max-w-[450px] mx-auto">
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea
            <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
                Recuperar
                <span className="block text-primary">Contrasena</span>
            </h1>
            <form className="mb-8">
                <div className="relative mb-8">
                    <RiMailFill className="absolute top-1/2 -translate-y-1/2 left-2" />
                    <input type="email" className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg focus:border focus:border-primary"
                        placeholder="Correo electronico"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
                    >
                        Enviar Instrucciones
                    </button>
                </div>
            </form>
            <div className="flex flex-col gap-4 items-center">
                <span className="flex items-center justify-center gap-2">
                    Ya tienes cuenta?
                    <Link
<<<<<<< HEAD
                        to="/auth"
=======
                        to="/login"
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea
                        className="text-primary hover:text-gray-100 transition-colors">
                        Ingresa
                    </Link>
                </span>
                <span className="flex items-center gap-2">
                    No tienes cuenta?
                    <Link
<<<<<<< HEAD
                        to="/auth/registro"
=======
                        to="/registro"
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea
                        className="text-primary hover:text-gray-100 transition-colors">
                        Registrate
                    </Link>
                </span>

            </div>
<<<<<<< HEAD
=======
         </div>
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea
        </div>
    );
};

export default ForgetPassword