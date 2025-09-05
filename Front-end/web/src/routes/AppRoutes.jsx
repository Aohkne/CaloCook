import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROLE } from '@constants/role';
import { ROUTES } from '@constants/routes';

import { ProtectedRoute, PublicRoute } from '@/middlewares';

import Login from '@/pages/(auth)/Login/Login';
import Register from '@/pages/(auth)/Register/Register';
import ForgetPassword from '@/pages/(auth)/ForgetPassword/ForgetPassword';
import ResetPassword from '@/pages/(auth)/ResetPassword/ResetPassword';
import Unauthorized from '@/pages/(auth)/Unauthorized/Unauthorized';

import Home from '@/pages/Home/Home';

import Dashboard from '@/pages/(admin)/Dashboard/Dashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path={ROUTES.HOME}
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* ERROR ROUTES */}
        <Route
          path={ROUTES.UNAUTHORIZED}
          element={
            <PublicRoute>
              <Unauthorized />
            </PublicRoute>
          }
        />

        {/* AUTH ROUTES */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute restricted={true}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute restricted={true}>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.FORGET_PASSWORD}
          element={
            <PublicRoute restricted={true}>
              <ForgetPassword />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <PublicRoute restricted={true}>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* * */}
        <Route
          path='*'
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
