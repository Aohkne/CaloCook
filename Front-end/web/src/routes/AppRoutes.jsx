import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROUTES } from '@constants/routes';

import Login from '@/pages/(auth)/Login/Login';
import Register from '@/pages/(auth)/Register/Register';
import ForgetPassword from '@/pages/(auth)/ForgetPassword/ForgetPassword';

import Home from '@/pages/Home/Home';

import Dashboard from '@/pages/(admin)/Dashboard/Dashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* AUTH */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />

        {/* LANDING PAGE */}
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* ADMIN */}
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
