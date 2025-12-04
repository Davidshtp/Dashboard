import React, { useState, useEffect } from "react";
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import { useCategoryStore } from "../../stores/categoryStore";
import { useInventoryStore } from "../../stores/inventoryStore";
import CategoryModal from "./CategoryModal"; 
import toast from "react-hot-toast";

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const { categories, loading, fetchCategories, deleteCategory } = useCategoryStore();
  const items = useInventoryStore((state) => state.items);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error("Error loading categories:", error);
      toast.error("Error al cargar categorías", { duration: 3000 });
    });
  }, []);

  const handleOpenModal = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    // Verificar si categoria está siendo usada por algún item
    const isCategoryInUse = items.some((item) => item.categoryId === id);

    if (isCategoryInUse) {
      toast.error("No se puede eliminar. La categoría está en uso por uno o más productos", { duration: 4000 });
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await deleteCategory(id);
        toast.success("Categoría eliminada correctamente", { duration: 2000 });
      } catch (error) {
        toast.error("Error al eliminar categoría", { duration: 3000 });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl text-white">Gestión de Categorías</h1>
          <button
            onClick={handleOpenModal}
            disabled={loading}
            className="bg-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiAddLine /> Agregar Categoría
          </button>
        </div>
        <hr className="my-8 border-gray-500/30" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-500/30">
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-gray-500">
                    Cargando categorías...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-gray-500">
                    No hay categorías creadas.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-500/30 hover:bg-secondary-900">
                    <td className="py-2 px-4">{category.name}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-primary hover:text-primary/80"
                        >
                          <RiPencilLine />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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

      <CategoryModal isOpen={isModalOpen} onClose={closeModal} categoryToEdit={categoryToEdit} />
    </>
  );
};

export default Categories;