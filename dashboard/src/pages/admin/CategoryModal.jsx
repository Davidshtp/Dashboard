import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCategoryStore } from "../../stores/categoryStore";
import toast from "react-hot-toast";

const CategoryModal = ({ isOpen, onClose, categoryToEdit }) => {
  const [name, setName] = useState("");

  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName("");
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío.");
      return;
    }

    if (categoryToEdit) {
      updateCategory({ ...categoryToEdit, name });
      toast.success("Categoría actualizada");
    } else {
      addCategory({ id: Date.now().toString(), name });
      toast.success("Categoría agregada");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 bg-secondary-100 p-8 rounded-xl">
          <DialogTitle className="font-bold text-xl text-white">
            {categoryToEdit ? "Editar Categoría" : "Agregar Categoría"}
          </DialogTitle>
          <hr className="my-4 border-gray-500/30" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
              >
                {categoryToEdit ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CategoryModal;