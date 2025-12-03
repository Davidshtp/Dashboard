import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RiBarChart2Line, RiArchiveStackLine, RiUserLine, RiShoppingCartLine } from "react-icons/ri";
import { useInventoryStore } from "../../stores/inventoryStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/formatters";

const Dashboard = () => {
  const items = useInventoryStore((state) => state.items);
  const fetchItems = useInventoryStore((state) => state.fetchItems);
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const currentUser = useAuthStore((state) => state.user);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchItems(), fetchCategories()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    loadData();
  }, [fetchItems, fetchCategories]);

  const totalItems = items.length;
  const totalCategories = categories.length;
  const lowStockItems = items.filter(item => item.quantity < 5).length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const statsCards = [
    {
      title: "Total Productos",
      value: totalItems,
      icon: <RiShoppingCartLine className="text-2xl" />,
      color: "bg-blue-500",
      link: "/dashboard/inventario"
    },
    {
      title: "Categorías",
      value: totalCategories,
      icon: <RiArchiveStackLine className="text-2xl" />,
      color: "bg-green-500",
      link: "/dashboard/categorias"
    },
    {
      title: "Stock Bajo",
      value: lowStockItems,
      icon: <RiBarChart2Line className="text-2xl" />,
      color: "bg-yellow-500",
      link: "/dashboard/stock-bajo"
    },
    {
      title: "Valor Total",
      value: formatCurrency(totalValue),
      icon: <RiBarChart2Line className="text-2xl" />,
      color: "bg-purple-500",
      link: "/dashboard/inventario"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="bg-secondary-100 p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          ¡Bienvenido, {currentUser?.name}!
        </h1>
        <p className="text-gray-400">
          Aquí tienes un resumen de tu inventario
        </p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-secondary-100 p-6 rounded-xl hover:bg-secondary-900 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-gray-400 text-sm">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Productos con stock bajo */}
      {lowStockItems > 0 && (
        <div className="bg-secondary-100 p-8 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">
            ⚠️ Productos con Stock Bajo
          </h2>
          <div className="space-y-2">
            {items
              .filter(item => item.quantity < 5)
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 px-4 bg-secondary-900 rounded-lg">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-yellow-400 font-semibold">
                    Stock: {item.quantity}
                  </span>
                </div>
              ))}
          </div>
          {lowStockItems > 5 && (
            <Link 
              to="/dashboard/inventario" 
              className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos los productos con stock bajo →
            </Link>
          )}
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/inventario"
          className="bg-primary text-black p-6 rounded-xl hover:bg-primary/90 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <RiShoppingCartLine className="text-2xl" />
            <div>
              <h3 className="font-bold">Gestionar Inventario</h3>
              <p className="text-sm opacity-80">Agregar, editar o eliminar productos</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/categorias"
          className="bg-secondary-100 border-2 border-primary text-white p-6 rounded-xl hover:bg-primary hover:text-black transition-colors group"
        >
          <div className="flex items-center gap-4">
            <RiArchiveStackLine className="text-2xl" />
            <div>
              <h3 className="font-bold">Gestionar Categorías</h3>
              <p className="text-sm opacity-80">Organizar productos por categorías</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;