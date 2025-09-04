import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROUTES } from '@constants/routes';

import Register from '@/pages/(auth)/Register/Register';

import Home from '@/pages/Home/Home';

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* AUTH */}
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* LANDING PAGE */}
        <Route path={ROUTES.HOME} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
