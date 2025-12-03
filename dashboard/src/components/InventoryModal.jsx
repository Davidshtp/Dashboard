import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useInventoryStore } from "../stores/inventoryStore";
import { useCategoryStore } from "../stores/categoryStore";
import { formatCurrency } from "../utils/formatters";
import toast from "react-hot-toast";

const InventoryModal = ({ isOpen, onClose, itemToEdit }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const categories = useCategoryStore((state) => state.categories);

  // Cargar datos del item cuando se abre en modo edición
  useEffect(() => {
    if (itemToEdit) {
      setForm({
        name: itemToEdit.name,
        description: itemToEdit.description,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
        categoryId: itemToEdit.categoryId,
      });
    } else {
      // Resetear formulario si es modo "Agregar"
      setForm({
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        categoryId: "",
      });
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mejoradas
    if (!form.name.trim()) {
      toast.error("El nombre del producto es requerido");
      return;
    }

    if (!form.categoryId) {
      toast.error("Debe seleccionar una categoría");
      return;
    }

    if (form.quantity < 0) {
      toast.error("La cantidad no puede ser negativa");
      return;
    }

    if (form.price <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        name: form.name.trim(),
        description: form.description.trim(),
        quantity: form.quantity,
        price: form.price,
        categoryId: form.categoryId,
      };

      if (itemToEdit) {
        await updateItem(itemToEdit.id, formData);
        toast.success("Producto actualizado correctamente");
      } else {
        await addItem(formData);
        toast.success("Producto agregado correctamente");
      }
      onClose();
    } catch (error) {
      const errorMsg = error?.detail || "Error al guardar producto";
      toast.error(errorMsg, { duration: 3000 });
      console.error("Inventory modal error:", error);
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
            {itemToEdit ? "Editar Producto" : "Agregar Producto"}
          </DialogTitle>
          <hr className="my-4 border-gray-500/30" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 resize-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Categoría</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={loading}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 disabled:opacity-50"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-300">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 disabled:opacity-50"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-300">Precio</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0"
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 disabled:opacity-50"
                  required
                />
                {form.price > 0 && (
                  <p className="text-xs text-primary mt-1">
                    {formatCurrency(form.price)}
                  </p>
                )}
              </div>
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
                {loading ? "Guardando..." : itemToEdit ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InventoryModal;