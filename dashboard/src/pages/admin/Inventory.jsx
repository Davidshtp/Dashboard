// src/pages/admin/Inventory.jsx
import React, { useState } from "react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import { useInventoryStore } from "../../stores/inventoryStore";
import InventoryModal from "../../components/InventoryModal";
import toast from "react-hot-toast";

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const items = useInventoryStore((state) => state.items);
  const deleteItem = useInventoryStore((state) => state.deleteItem);

  const handleOpenModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    toast.error("Producto eliminado", { duration: 2000 });
    deleteItem(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl text-white">Inventario</h1>
          <button
            onClick={handleOpenModal}
            className="bg-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
          >
            <RiAddLine /> Agregar Producto
          </button>
        </div>
        <hr className="my-8 border-gray-500/30" />

        {/* Tabla de Inventario */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-500/30">
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Descripción</th>
                <th className="py-2 px-4 text-left">Cantidad</th>
                <th className="py-2 px-4 text-left">Precio</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No hay productos en el inventario.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-500/30 hover:bg-secondary-900">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-gray-400">{item.description}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">${item.price}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-1 text-primary hover:text-primary/80"
                        >
                          <RiPencilLine />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-400"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        itemToEdit={itemToEdit}
      />
    </>
  );
};

export default Inventory;