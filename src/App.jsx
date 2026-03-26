import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { CarriageDetail } from './screens/CarriageDetail'
import { FleetDashboard } from './screens/FleetDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <FleetDashboard /> },
      { path: 'carriage/:carriageId', element: <CarriageDetail /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
