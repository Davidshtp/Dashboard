import React, { useEffect, useState } from "react";
// Icons
import {
  RiEdit2Line,
} from "react-icons/ri";
import { useUserStore } from "../../stores/useUserStore";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

const Profile = () => {
  const currentUser = useUserStore((s) => s.currentUser);
  const updateCurrentUser = useUserStore((s) => s.updateCurrentUser);
  const updateEmail = useUserStore((s) => s.updateEmail);
  const changePassword = useUserStore((s) => s.changePassword);
  const setAuthUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setLastName(currentUser.lastName || "");
      setNewEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const onSubmitProfile = (e) => {
    e.preventDefault();
    const res = updateCurrentUser({ name, lastName });
    if (res === "success") {
      const updated = useUserStore.getState().currentUser;
      if (updated) setAuthUser(updated);
      toast.success("Perfil actualizado");
    } else {
      toast.error("No hay usuario autenticado");
    }
  };

  const onSaveEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Correo inválido");
      return;
    }
    const res = updateEmail(newEmail.trim());
    if (res === "email-exists") {
      toast.error("El correo ya está registrado");
      return;
    }
    if (res === "success") {
      const updated = useUserStore.getState().currentUser;
      if (updated) setAuthUser(updated);
      toast.success("Correo actualizado");
      setEditingEmail(false);
    } else {
      toast.error("No hay usuario autenticado");
    }
  };

  const onSavePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("Completa todos los campos");
      return;
    }
    if (newPwd.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    const res = changePassword(currentPwd, newPwd);
    if (res === "wrong-current") {
      toast.error("Contraseña actual incorrecta");
      return;
    }
    if (res === "success") {
      const updated = useUserStore.getState().currentUser;
      if (updated) setAuthUser(updated);
      toast.success("Contraseña actualizada");
      setEditingPassword(false);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      toast.error("No hay usuario autenticado");
    }
  };
  return (
    <>
      {/* Profile */}
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <h1 className="text-xl text-gray-100">Profile</h1>
        <hr className="my-8 border-gray-500/30" />
        <form onSubmit={onSubmitProfile}>
          <div className="flex items-center mb-8">
            <div className="w-1/4">
              <p>Avatar</p>
            </div>
            <div className="flex-1">
              <div className="relative mb-2">
                <img
                  src="https://img.freepik.com/foto-gratis/negocios-finanzas-empleo-concepto-mujeres-emprendedoras-exitosas-joven-empresaria-segura-anteojos-mostrando-gesto-pulgar-arriba-sostenga-computadora-portatil-garantice-mejor-calidad-servicio_1258-59118.jpg"
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bg-secondary-100 p-2 rounded-full hover:cursor-pointer -top-2 left-24"
                >
                  <RiEdit2Line />
                </label>
                <input type="file" id="avatar" className="hidden" />
              </div>
              <p className="text-gray-500 text-sm">
                Allowed file types: png, jpg, jpeg.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 md:flex-row md:items-center mb-8">
            <div className="w-full md:w-1/4">
              <p>
                Nombre completo <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900"
                  placeholder="Nombre(s)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900"
                  placeholder="Apellido(s)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8">
            <div className="w-full md:w-1/4">
              <p>
                País <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex-1">
              <select className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 appearance-none">
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
                <option value="México">México</option>
                <option value="Perú">Perú</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Venezuela">Venezuela</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8">
            <div className="w-full md:w-1/4">
              <p>
                Ciudad <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex-1">
              <select className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 appearance-none">
                <option value="Barquisiméto">Barquisiméto</option>
                <option value="Bogotá">Bogotá</option>
                <option value="Buga">Buga</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Lima">Lima</option>
                <option value="Montevideo">Montevideo</option>
                <option value="Caracas">Caracas</option>
                <option value="Venezuela">Venezuela</option>
              </select>
            </div>
          </div>
        </form>
        <hr className="my-8 border-gray-500/30" />
        <div className="flex justify-end">
          <button type="button" onClick={onSubmitProfile} className="bg-primary/80 text-black py-2 px-4 rounded-lg hover:bg-primary transition-colors">
            Guardar
          </button>
        </div>
      </div>
      {/* Change password */}
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <h1 className="text-xl text-gray-100">Usuario y contraseña</h1>
        <hr className="my-8 border-gray-500/30" />
        <form className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-y-4 justify-between">
            <div>
              <h5 className="text-gray-100 text-xl mb-1">Correo electrónico</h5>
              {!editingEmail ? (
                <p className="text-gray-500 text-sm">{currentUser?.email || ""}</p>
              ) : (
                <div className="mt-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="py-2 px-3 bg-secondary-900 rounded-lg w-full md:w-80 outline-none"
                    placeholder="Nuevo correo"
                  />
                </div>
              )}
            </div>
            <div>
              {!editingEmail ? (
                <button type="button" onClick={() => setEditingEmail(true)} className="w-full md:w-auto bg-secondary-900/50 py-3 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors">
                  Cambiar email
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="button" onClick={onSaveEmail} className="bg-primary/80 text-black py-3 px-4 rounded-lg hover:bg-primary transition-colors">Guardar</button>
                  <button type="button" onClick={() => { setEditingEmail(false); setNewEmail(currentUser?.email || ""); }} className="bg-secondary-900/50 py-3 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors">Cancelar</button>
                </div>
              )}
            </div>
          </div>
          <hr className="my-8 border-gray-500/30 border-dashed" />
          <div className="flex flex-col md:flex-row md:items-center gap-y-4 justify-between">
            <div>
              <h5 className="text-gray-100 text-xl mb-1">Contraseña</h5>
              {!editingPassword ? (
                <p className="text-gray-500 text-sm">****************</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="py-2 px-3 bg-secondary-900 rounded-lg outline-none"
                    placeholder="Contraseña actual"
                  />
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="py-2 px-3 bg-secondary-900 rounded-lg outline-none"
                    placeholder="Nueva contraseña"
                  />
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="py-2 px-3 bg-secondary-900 rounded-lg outline-none"
                    placeholder="Confirmar nueva contraseña"
                  />
                </div>
              )}
            </div>
            <div>
              {!editingPassword ? (
                <button type="button" onClick={() => setEditingPassword(true)} className="w-full md:auto bg-secondary-900/50 py-3 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors">
                  Cambiar contraseña
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="button" onClick={onSavePassword} className="bg-primary/80 text-black py-3 px-4 rounded-lg hover:bg-primary transition-colors">Guardar</button>
                  <button type="button" onClick={() => { setEditingPassword(false); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); }} className="bg-secondary-900/50 py-3 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors">Cancelar</button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      
    </>
  );
};

export default Profile;
