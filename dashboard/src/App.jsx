import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Error404 from "./pages/Error404";
import Register from "./pages/auth/Register";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Home from "./pages/admin/Home";
import Profile from "./pages/admin/Profile";
import LayoutAuth from "./layouts/LayoutAuth";
import ForgetPassword from "./pages/auth/ForgetPassword";
<<<<<<< HEAD
import { Profiler } from "react";
=======
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea

function App() {
  return <BrowserRouter>
    <Routes>
<<<<<<< HEAD
      <Route path="/login" element={<LayoutAuth />}>
      <Route path="registro" element={<Register />} />
      <Route path="olvide-password" element={<ForgetPassword />} />
      <Route path="/" element={<LayoutAdmin />}></Route>
        <Route index element={<Login />} />
      </Route>
        <Route index element={<Home />} />
        <Route path="/perfil" element={<Profile />}>
=======
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/olvide-password" element={<ForgetPassword />} />
      <Route path="/" element={<LayoutAdmin />}>
        <Route index element={<Home />} />
        <Route path="perfil" element={<Profile />} />
>>>>>>> 75c6c821cd5a8f19ee5ee73a6573d4dbdb2ab1ea
      </Route>
      //todas las demas rutas
      <Route path="*" element={<Error404 />} />
    </Routes>
  </BrowserRouter>
}

export default App;