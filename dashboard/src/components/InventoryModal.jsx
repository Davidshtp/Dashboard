// src/components/InventoryModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useInventoryStore } from "../stores/inventoryStore";
import toast from "react-hot-toast";

const InventoryModal = ({ isOpen, onClose, itemToEdit }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });

  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);

  // Cargar datos del item cuando se abre en modo edición
  useEffect(() => {
    if (itemToEdit) {
      setForm(itemToEdit);
    } else {
      // Resetear formulario si es modo "Agregar"
      setForm({
        id: Date.now().toString(),
        name: "",
        description: "",
        quantity: 0,
        price: 0,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itemToEdit) {
      updateItem(form);
      toast.success("Producto actualizado");
    } else {
      addItem(form);
      toast.success("Producto agregado");
    }
    onClose(); // Cierra el modal
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Contenido del Modal */}
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
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1 resize-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-300">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1"
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
                  className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-900 mt-1"
                  required
                />
              </div>
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
                {itemToEdit ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InventoryModal;