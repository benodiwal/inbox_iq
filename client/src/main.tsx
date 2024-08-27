import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App'
import { Outlet, RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Home from './pages/Home'
import BaseLayout from './layouts/BaseLayout'
import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleOAuthProvider } from "@react-oauth/google"
import AppLayout from './layouts/AppLayout'
import AuthContext from './context/AuthContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    element: (
        <AuthContext>
          <BaseLayout>
           <Outlet />
          </BaseLayout>
        </AuthContext>
      ),
      children: [
        {
          element: (
            <AppLayout>
              <Outlet />
            </AppLayout>
            ),
            children: [
              {
                path: '/app',
                element: <App />,
              },
            ]
        }
      ]
  }
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
