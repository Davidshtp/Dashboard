import { RiNotification3Line, RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine } from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { Link, useNavigate } from 'react-router-dom';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente", { duration: 2000 });

    setTimeout(() => {
      navigate("/login");
    }, 2100);
  };

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${currentUser?.name ?? ""} ${currentUser?.lastName ?? ""}`
  )}&background=0D8ABC&color=fff`;

  return (
    <header className="h-[7vh] md:h-[10vh] border-b border-secondary-100 p-8 flex items-center justify-end">
      <nav className="flex items-center gap-2">

        {/* Notifications */}
        <Menu
          menuButton={
            <MenuButton className="relative hover:bg-secondary-100 p-2 rounded-lg transition-colors">
              <RiNotification3Line />
              <span className="absolute -top-0.5 right-0 bg-primary py-0.5 px-[5px] box-content
                text-black rounded-full text-[8px] font-bold">
                2
              </span>
            </MenuButton>
          }
          align="end"
          transition
          arrow
          arrowClassName="bg-secondary-100"
          menuClassName="bg-secondary-100 p-4"
        >
          <h1 className="text-gray-300 text-center font-medium">Notificaciones (2)</h1>
          <hr className="my-6 border-gray-500" />

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="" className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-900 
              transition-colors rounded-lg">
              <img src={avatar} className="w-8 h-8 object-cover rounded-full" />
              <div className="text-sm flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span>{currentUser?.name}</span>
                  <span className="text-[8px]">Hoy</span>
                </div>
                <p className="text-gray-500 text-xs">Lorem Ipsum dolor sit amet...</p>
              </div>
            </Link>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 hover:bg-secondary-100 p-2 rounded-lg transition-colors">
              <img src={avatar} className="w-6 h-6 object-cover rounded-full" />
              <span>{currentUser?.name} {currentUser?.lastName}</span>
              <RiArrowDownSLine />
            </MenuButton>
          }
          align="end"
          arrow
          arrowClassName="bg-secondary-100"
          transition
          menuClassName="bg-secondary-100 p-4"
        >

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="/dashboard/perfil" className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex
              items-center gap-x-4 py-2 px-6 flex-1">
              <img src={avatar} className="w-8 h-8 object-cover rounded-full" />
              <div className="flex flex-col text-sm">
                <span>{currentUser?.name} {currentUser?.lastName}</span>
                <span className="text-xs text-gray-500">{currentUser?.email}</span>
              </div>
            </Link>
          </MenuItem>

          <hr className="my-4 border-gray-500" />

          <MenuItem className="p-0 hover:bg-transparent">
            <Link to="/configuracion" className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex
              items-center gap-x-4 py-2 px-6 flex-1">
              <RiSettings3Line /> Configuración
            </Link>
          </MenuItem>

          <MenuItem className="p-0 hover:bg-transparent" onClick={handleLogout}>
            <button className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex
              items-center gap-x-4 py-2 px-6 flex-1">
              <RiLogoutCircleRLine /> Cerrar sesión
            </button>
          </MenuItem>

        </Menu>
      </nav>
    </header>
  );
};

export default Header;
