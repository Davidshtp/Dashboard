import { RiNotification3Line, RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine } from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { Link, useNavigate } from 'react-router-dom';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const Header = () => {
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente", { duration: 2000 });

    setTimeout(() => {
      navigate("/login");
    }, 2100);
  };

  // Obtener initiales para avatar por defecto
  const getInitials = () => {
    if (!currentUser?.name && !currentUser?.lastName) return "U";
    const first = currentUser?.name?.charAt(0) || "";
    const last = currentUser?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  // Avatar a mostrar
  const getAvatarSrc = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar;
    }
    return `https://ui-avatars.com/api/?name=${getInitials()}&background=0D8ABC&color=fff`;
  };

  const avatar = getAvatarSrc();

  return (
    <header className="h-[7vh] md:h-[10vh] border-b border-secondary-100 p-8 flex items-center justify-end">
      <nav className="flex items-center gap-2">

        {/* Notifications */}
        <Menu
          menuButton={
            <MenuButton className="relative hover:bg-secondary-100 p-2 rounded-lg transition-colors text-gray-300">
              <RiNotification3Line className="text-xl" />
              <span className="absolute -top-0.5 right-0 bg-primary py-0.5 px-[5px] box-content
                text-black rounded-full text-[8px] font-bold">
                2
              </span>
            </MenuButton>
          }
          align="end"
          transition
          arrow
          arrowClassName="!bg-secondary-100"
          menuClassName="!bg-secondary-100 !p-4 !border-gray-600"
        >
          <h1 className="text-primary text-center font-bold mb-2 text-lg">Notificaciones (2)</h1>
          <hr className="my-4 border-gray-600" />

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="" className="text-gray-200 flex flex-1 items-center gap-4 py-3 px-4 hover:bg-secondary-900 
              transition-colors rounded-lg w-full">
              <img src={avatar} className="w-8 h-8 object-cover rounded-full" />
              <div className="text-sm flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white font-medium">{currentUser?.name}</span>
                  <span className="text-xs text-gray-400">Hoy</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Lorem Ipsum dolor sit amet...</p>
              </div>
            </Link>
          </MenuItem>

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="" className="text-gray-200 flex flex-1 items-center gap-4 py-3 px-4 hover:bg-secondary-900 
              transition-colors rounded-lg w-full">
              <img src={avatar} className="w-8 h-8 object-cover rounded-full" />
              <div className="text-sm flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white font-medium">{currentUser?.name}</span>
                  <span className="text-xs text-gray-400">Ayer</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Nueva actualización disponible</p>
              </div>
            </Link>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 hover:bg-secondary-100 p-2 rounded-lg transition-colors text-gray-300">
              <img src={avatar} className="w-6 h-6 object-cover rounded-full" />
              <span className="text-white">{currentUser?.name} {currentUser?.lastName}</span>
              <RiArrowDownSLine className="text-gray-400" />
            </MenuButton>
          }
          align="end"
          arrow
          arrowClassName="!bg-secondary-100"
          transition
          menuClassName="!bg-secondary-100 !p-4 !border-gray-600"
        >

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="/dashboard/perfil" className="rounded-lg transition-colors text-gray-200 hover:bg-secondary-900 flex
              items-center gap-x-4 py-3 px-6 flex-1 w-full">
              <img src={avatar} className="w-10 h-10 object-cover rounded-full" />
              <div className="flex flex-col text-sm">
                <span className="text-white font-medium">{currentUser?.name} {currentUser?.lastName}</span>
                <span className="text-xs text-gray-400">{currentUser?.email}</span>
              </div>
            </Link>
          </MenuItem>

          <hr className="my-4 border-gray-600" />

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="/configuracion" className="rounded-lg transition-colors text-gray-200 hover:bg-secondary-900 flex
              items-center gap-x-4 py-3 px-6 flex-1 w-full">
              <RiSettings3Line className="text-gray-400" />
              <span className="text-white">Configuración</span>
            </Link>
          </MenuItem>

          <MenuItem className="p-0 hover:bg-transparent" onClick={handleLogout}>
            <button className="rounded-lg transition-colors text-gray-200 hover:bg-secondary-900 flex
              items-center gap-x-4 py-3 px-6 flex-1 w-full text-left">
              <RiLogoutCircleRLine className="text-red-400" />
              <span className="text-white">Cerrar sesión</span>
            </button>
          </MenuItem>

        </Menu>
      </nav>
    </header>
  );
};

export default Header;
