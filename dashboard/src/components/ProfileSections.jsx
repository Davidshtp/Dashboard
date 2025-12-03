import { RiEdit2Line, RiCloseLine } from "react-icons/ri";
// Avatar Upload Section
export const AvatarSection = ({ 
  avatarPreview, 
  initials, 
  onFileChange, 
  onRemove 
}) => (
  <div className="flex items-center mb-8">
    <div className="w-1/4">
      <p>Avatar</p>
    </div>
    <div className="flex-1">
      <div className="relative mb-2 w-fit">
        {avatarPreview ? (
          <>
            <img
              src={avatarPreview}
              className="w-28 h-28 object-cover rounded-lg"
              alt="Avatar preview"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <RiCloseLine className="text-white" />
            </button>
          </>
        ) : (
          <div className="w-28 h-28 rounded-lg bg-secondary-900 flex items-center justify-center text-3xl font-bold text-gray-400">
            {initials}
          </div>
        )}
        <label
          htmlFor="avatar"
          className="absolute bg-secondary-100 p-2 rounded-full hover:cursor-pointer -top-2 -left-2 hover:bg-secondary-200 transition-colors"
        >
          <RiEdit2Line className="text-gray-100" />
        </label>
        <input
          type="file"
          id="avatar"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={onFileChange}
        />
      </div>
      <p className="text-gray-500 text-sm">
        Tipos permitidos: PNG, JPG, JPEG (máx. 2MB)
      </p>
    </div>
  </div>
);

// Edit Field Section
export const EditFieldSection = ({
  title,
  value,
  isEditing,
  onToggleEdit,
  onSave,
  onCancel,
  isLoading,
  children,
}) => (
  <div className="flex flex-col md:flex-row md:items-end gap-y-4 md:gap-4 justify-between">
    <div className="flex-1">
      <h5 className="text-gray-100 text-lg mb-3">{title}</h5>
      {!isEditing ? (
        <p className="text-gray-500 text-sm">{value}</p>
      ) : (
        <div>{children}</div>
      )}
    </div>
    <div className="flex gap-2 flex-shrink-0">
      {!isEditing ? (
        <button
          type="button"
          onClick={onToggleEdit}
          className="w-full md:w-auto bg-secondary-900/50 py-2 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors whitespace-nowrap"
        >
          Cambiar {title.toLowerCase()}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={isLoading}
            className="bg-primary/80 text-black py-2 px-4 rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-secondary-900/50 py-2 px-4 rounded-lg hover:bg-secondary-900 hover:text-gray-100 transition-colors whitespace-nowrap"
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  </div>
);

// Input Field
export const InputField = ({
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="py-2 px-3 bg-secondary-900 rounded-lg w-full outline-none text-gray-100"
    placeholder={placeholder}
  />
);
