import React, { useState, useEffect } from "react";
import { RiAlertLine } from "react-icons/ri";
import { useInventoryStore } from "../../stores/inventoryStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { formatCurrency } from "../../utils/formatters";
import toast from "react-hot-toast";

const LowStock = () => {
  const { items, loading, fetchItems } = useInventoryStore();
  const { categories } = useCategoryStore();

  // Cargar items al montar el componente
  useEffect(() => {
    fetchItems().catch((error) => {
      console.error("Error loading items:", error);
      toast.error("Error al cargar productos", { duration: 3000 });
    });
  }, []);

  // Filtrar productos con stock bajo (< 5)
  const lowStockItems = items.filter((item) => item.quantity < 5);

  // Obtener nombre de categoría por ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  return (
    <>
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <RiAlertLine className="text-yellow-500 text-2xl" />
          <h1 className="text-xl text-white">Productos con Stock Bajo</h1>
        </div>
        <p className="text-gray-400 mb-4">Productos con cantidad menor a 5 unidades</p>
        <hr className="my-8 border-gray-500/30" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-500/30">
                <th className="py-2 px-4 text-left">Producto</th>
                <th className="py-2 px-4 text-left">Categoría</th>
                <th className="py-2 px-4 text-center">Stock</th>
                <th className="py-2 px-4 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {loading && lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    Cargando productos...
                  </td>
                </tr>
              ) : lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    ¡Excelente! No hay productos con stock bajo.
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-500/30 hover:bg-secondary-900 ${
                      item.quantity === 0 ? "bg-red-500/10" : "bg-yellow-500/5"
                    }`}
                  >
                    <td className="py-2 px-4">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.quantity === 0
                            ? "bg-red-500 text-white"
                            : item.quantity <= 2
                            ? "bg-orange-500 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right font-medium text-primary">
                      {formatCurrency(item.price)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {lowStockItems.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-500 text-sm">
              ⚠️ Tienes <strong>{lowStockItems.length}</strong> producto{lowStockItems.length > 1 ? "s" : ""} con stock bajo. Se recomienda reabastecer.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default LowStock;
