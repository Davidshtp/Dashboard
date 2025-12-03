import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../stores/authStore";
import { profileService } from "../../services/profileService";
import { compressImage } from "../../utils/imageCompression";
import {
  AvatarSection,
  EditFieldSection,
  InputField,
} from "../../components/ProfileSections";
import toast from "react-hot-toast";

const Profile = () => {
  const currentUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    currentPwd: "",
    newPwd: "",
    confirmPwd: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState({
    profile: false,
    email: false,
    password: false,
  });

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
      }));
      if (currentUser.avatar) {
        setAvatarPreview(currentUser.avatar);
      }
    }
  }, [currentUser]);

  // Get initials
  const getInitials = useCallback(() => {
    const first = currentUser?.name?.charAt(0) || "";
    const last = currentUser?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  }, [currentUser]);

  // Handle file upload with compression
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file);
      setAvatarPreview(compressedDataUrl);
      setAvatar(compressedDataUrl);
    } catch (error) {
      toast.error(error.message || "Error al procesar imagen");
    }
  }, []);

  // Handle input change
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Validate profile data
  const validateProfile = useCallback(() => {
    if (!formData.name.trim() || !formData.lastName.trim()) {
      toast.error("Nombre y apellido son requeridos");
      return false;
    }
    return true;
  }, [formData]);

  // Validate email
  const validateEmail = useCallback(() => {
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Correo inválido");
      return false;
    }
    if (formData.email === currentUser?.email) {
      toast.error("El nuevo correo es igual al actual");
      return false;
    }
    return true;
  }, [formData.email, currentUser?.email]);

  // Validate password
  const validatePassword = useCallback(() => {
    if (!formData.currentPwd || !formData.newPwd || !formData.confirmPwd) {
      toast.error("Completa todos los campos");
      return false;
    }
    if (formData.newPwd.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.newPwd !== formData.confirmPwd) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    if (formData.newPwd === formData.currentPwd) {
      toast.error("La nueva contraseña debe ser diferente a la actual");
      return false;
    }
    return true;
  }, [formData.currentPwd, formData.newPwd, formData.confirmPwd]);

  // Submit profile
  const onSubmitProfile = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateProfile()) return;

      try {
        setLoading((prev) => ({ ...prev, profile: true }));
        const updateData = {
          name: formData.name.trim(),
          lastName: formData.lastName.trim(),
          ...(avatar && { avatar }),
        };

        const updatedUser = await profileService.updateProfile(
          currentUser?.id,
          updateData
        );
        setUser(updatedUser);
        setAvatar(null);
        toast.success("Perfil actualizado correctamente");
      } catch (error) {
        toast.error(error.message || "Error al actualizar perfil");
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    },
    [validateProfile, formData.name, formData.lastName, avatar, currentUser?.id, setUser]
  );

  // Submit email
  const onSaveEmail = useCallback(
    async () => {
      if (!validateEmail()) return;

      try {
        setLoading((prev) => ({ ...prev, email: true }));
        const updatedUser = await profileService.updateEmail(
          currentUser?.id,
          formData.email.trim()
        );
        setUser(updatedUser);
        setFormData((prev) => ({ ...prev, email: updatedUser.email }));
        toast.success("Correo actualizado correctamente");
        setEditingEmail(false);
      } catch (error) {
        toast.error(error.message || "Error al actualizar correo");
      } finally {
        setLoading((prev) => ({ ...prev, email: false }));
      }
    },
    [validateEmail, formData.email, currentUser?.id, setUser]
  );

  // Submit password
  const onSavePassword = useCallback(
    async () => {
      if (!validatePassword()) return;

      try {
        setLoading((prev) => ({ ...prev, password: true }));
        await profileService.changePassword(
          currentUser?.id,
          formData.currentPwd,
          formData.newPwd
        );
        setFormData((prev) => ({
          ...prev,
          currentPwd: "",
          newPwd: "",
          confirmPwd: "",
        }));
        toast.success("Contraseña actualizada correctamente");
        setEditingPassword(false);
      } catch (error) {
        toast.error(error.message || "Error al actualizar contraseña");
      } finally {
        setLoading((prev) => ({ ...prev, password: false }));
      }
    },
    [
      validatePassword,
      formData.currentPwd,
      formData.newPwd,
      currentUser?.id,
    ]
  );

  return (
    <>
      {/* Profile Section */}
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <h1 className="text-xl text-gray-100">Perfil</h1>
        <hr className="my-8 border-gray-500/30" />
        <form onSubmit={onSubmitProfile}>
          <AvatarSection
            avatarPreview={avatarPreview}
            initials={getInitials()}
            onFileChange={handleFileChange}
            onRemove={() => setAvatarPreview(null)}
          />

          {/* Name and LastName */}
          <div className="flex flex-col gap-y-2 md:flex-row md:items-center mb-8">
            <div className="w-full md:w-1/4">
              <p>
                Nombre completo <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <InputField
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                placeholder="Nombre(s)"
              />
              <InputField
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                placeholder="Apellido(s)"
              />
            </div>
          </div>
        </form>

        <hr className="my-8 border-gray-500/30" />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSubmitProfile}
            disabled={loading.profile}
            className="bg-primary/80 text-black py-2 px-4 rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.profile ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Email and Password Section */}
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <h1 className="text-xl text-gray-100">Usuario y contraseña</h1>
        <hr className="my-8 border-gray-500/30" />

        {/* Email */}
        <div className="mb-8">
          <EditFieldSection
            title="Correo electrónico"
            value={currentUser?.email || ""}
            isEditing={editingEmail}
            onToggleEdit={() => setEditingEmail(true)}
            onSave={onSaveEmail}
            onCancel={() => {
              setEditingEmail(false);
              setFormData((prev) => ({ ...prev, email: currentUser?.email || "" }));
            }}
            isLoading={loading.email}
          >
            <InputField
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Nuevo correo"
            />
          </EditFieldSection>

          <hr className="my-8 border-gray-500/30 border-dashed" />

          {/* Password */}
          <EditFieldSection
            title="Contraseña"
            value="••••••••••••"
            isEditing={editingPassword}
            onToggleEdit={() => setEditingPassword(true)}
            onSave={onSavePassword}
            onCancel={() => {
              setEditingPassword(false);
              setFormData((prev) => ({
                ...prev,
                currentPwd: "",
                newPwd: "",
                confirmPwd: "",
              }));
            }}
            isLoading={loading.password}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputField
                type="password"
                value={formData.currentPwd}
                onChange={(value) => handleInputChange("currentPwd", value)}
                placeholder="Contraseña actual"
              />
              <InputField
                type="password"
                value={formData.newPwd}
                onChange={(value) => handleInputChange("newPwd", value)}
                placeholder="Nueva contraseña"
              />
              <InputField
                type="password"
                value={formData.confirmPwd}
                onChange={(value) => handleInputChange("confirmPwd", value)}
                placeholder="Confirmar nueva"
              />
            </div>
          </EditFieldSection>
        </div>
      </div>
    </>
  );
};

export default Profile;
