import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiBarChart2Line,
  RiEarthLine,
  RiCustomerService2Line,
  RiLogoutCircleLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiArchiveStackLine,
} from "react-icons/ri";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente", { duration: 2000 });
    setTimeout(() => navigate("/login"), 2100);
  };

  return (
    <>
      <div className={`xl:h-[100vh] overflow-y-scroll scrollbar-hide sidebar-container fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-100 p-4 flex flex-col justify-between z-50 ${showMenu ? "left-0" : "-left-full"} transition-all`}>
        <div>
          <h1 className="text-center text-2xl font-bold text-white mb-10">
            Admin<span className="text-primary text-4xl">.</span>
          </h1>
          <ul>
            <li>
              {/* RUTA INVENTARIO*/}
              <Link to="/dashboard/inventario" className=" flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors">
                <RiBarChart2Line className="text-primary" />
                Inventario
              </Link>
            </li>
            <li>
              <button onClick={() => setShowSubmenu(!showSubmenu)} className=" w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors">
                <span className="flex items-center gap-4 ">
                  <RiEarthLine className="text-primary" /> Gestion Inventario
                </span>
                <RiArrowRightSLine className={`mt-1 ${showSubmenu && "rotate-90"} transition-all`} />
              </button>
              <ul className={`my-2 ${!showSubmenu && "hidden"}`}>
                <li>
                  {/* RUTA CATEGORIA*/}
                  <Link
                    to="/dashboard/categorias"
                    className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-2 before:border-secondary-100 hover:text-white transition-colors">
                    Categorias
                  </Link>
                </li>
                <li>
                  <Link to="/" className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-gray-500 before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-2 before:border-secondary-100 hover:text-white transition-colors">
                    Sin Stock
                  </Link>
                </li>
                <li>
                  <Link to="/" className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-gray-500 before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-2 before:border-secondary-100 hover:text-white transition-colors">
                    Inactivos
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors w-full text-left"
          >
            <RiLogoutCircleLine className="text-primary" />
            Cerrar Sesión
          </button>
        </nav>
      </div>

      <button onClick={() => setShowMenu(!showMenu)} className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50">
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default Sidebar;