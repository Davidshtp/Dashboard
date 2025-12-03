import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCategoryStore } from "../../stores/categoryStore";
import toast from "react-hot-toast";

const CategoryModal = ({ isOpen, onClose, categoryToEdit }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const categories = useCategoryStore((state) => state.categories);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName("");
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("El nombre debe tener al menos 2 caracteres");
      return;
    }

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === trimmedName.toLowerCase() && 
             (!categoryToEdit || cat.id !== categoryToEdit.id)
    );

    if (existingCategory) {
      toast.error("Ya existe una categoría con ese nombre");
      return;
    }

    setLoading(true);

    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit.id, trimmedName);
        toast.success("Categoría actualizada correctamente");
      } else {
        await addCategory(trimmedName);
        toast.success("Categoría agregada correctamente");
      }
      onClose();
    } catch (error) {
      const errorMsg = error?.detail || "Error al guardar categoría";
      toast.error(errorMsg, { duration: 3000 });
      console.error("Category modal error:", error);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 disabled:opacity-50"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : categoryToEdit ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CategoryModal;