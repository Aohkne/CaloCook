import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROLE } from '@constants/role';
import { ROUTES } from '@constants/routes';

import { ProtectedRoute, PublicRoute } from '@/middlewares';

//AUTH
import Login from '@/pages/(auth)/Login/Login';
import Register from '@/pages/(auth)/Register/Register';
import ForgetPassword from '@/pages/(auth)/ForgetPassword/ForgetPassword';
import ResetPassword from '@/pages/(auth)/ResetPassword/ResetPassword';
import NewPassword from '@/pages/(auth)/NewPassword/NewPassword';
import Unauthorized from '@/pages/(auth)/Unauthorized/Unauthorized';

//LANDING PAGE
import Home from '@/pages/Home/Home';

//ADMIN
import Dashboard from '@/pages/(admin)/Dashboard/Dashboard';
import UserManagement from '@/pages/(admin)/UserManagement/UserManagement';
import DishManagement from '@/pages/(admin)/DishManagement/DishManagement';
import ReportManagement from '@/pages/(admin)/ReportManagement/ReportManagement';
import Chat from '@/pages/(admin)/Chat/Chat';
import ProfileAdmin from '@/pages/(admin)/ProfileAdmin/ProfileAdmin';
import ChangePasswordAdmin from '@/pages/(admin)/ChangePasswordAdmin/ChangePasswordAdmin';

//USER
import Dish from '@/pages/(user)/Dish/Dish';
import Favorite from '@/pages/(user)/Favorite/Favorite';
import ChatAI from '@/pages/(user)/ChatAI/ChatAI';
import ProfileUser from '@/pages/(user)/ProfileUser/ProfileUser';
import ChangePassword from '@/pages/(user)/ChangePassword/ChangePassword';

function AppRoutes() {
  return (
    <BrowserRouter>
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

        <Route
          path={ROUTES.NEW_PASSWORD}
          element={
            <PublicRoute restricted={true}>
              <NewPassword />
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

        <Route
          path={ROUTES.USER_MANAGEMENT}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DISH_MANAGEMENT}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <DishManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.REPORT_MANAGEMENT}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <ReportManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CHAT}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE_ADMIN}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <ProfileAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHANGE_PASSWORD_ADMIN}
          element={
            <ProtectedRoute requiredRole={ROLE.ADMIN}>
              <ChangePasswordAdmin />
            </ProtectedRoute>
          }
        />

        {/* USER ROUTES */}
        <Route
          path={ROUTES.DISH}
          element={
            <ProtectedRoute requiredRole={ROLE.USER}>
              <Dish />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FAVORITE}
          element={
            <ProtectedRoute requiredRole={ROLE.USER}>
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHAT_AI}
          element={
            <ProtectedRoute requiredRole={ROLE.USER}>
              <ChatAI />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE_USER}
          element={
            <ProtectedRoute requiredRole={ROLE.USER}>
              <ProfileUser />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={
            <ProtectedRoute requiredRole={ROLE.USER}>
              <ChangePassword />
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