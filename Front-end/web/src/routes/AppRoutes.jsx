import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import Home from '@/pages/Home/Home';

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
