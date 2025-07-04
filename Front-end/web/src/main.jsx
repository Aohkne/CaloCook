import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from 'react-router-dom';
import UserManagementPage from './pages/UserManagementPage.jsx';
import DishManagementPage from './pages/DishManagementPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './components/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		element: <ProtectedRoute />,
		children: [
			{
				path: '/',
				element: <Navigate to="/users" replace />,
			},
			{
				path: '/users',
				element: <App />,
				children: [{ path: '', element: <UserManagementPage /> }],
			},
			{
				path: '/dishes',
				element: <App />,
				children: [{ path: '', element: <DishManagementPage /> }],
			},
			{
				path: '/profile',
				element: <App />,
				children: [{ path: '', element: <ProfilePage /> }],
			},
		],
	},
]);
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId={clientId}>
		<StrictMode>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</StrictMode>
	</GoogleOAuthProvider>
);
