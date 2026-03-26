import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { CarriageDetail } from './screens/CarriageDetail'
import { FleetDashboard } from './screens/FleetDashboard'
import { IssueManagement } from './screens/IssueManagement'
import { PlaceholderScreen } from './screens/PlaceholderScreen'
import { TrainDetail } from './screens/TrainDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <FleetDashboard /> },
      { path: 'train/:trainId', element: <TrainDetail /> },
      { path: 'train/:trainId/carriage/:carriageId', element: <CarriageDetail /> },
      { path: 'issues', element: <IssueManagement /> },
      { path: 'reports', element: <PlaceholderScreen title="Reports" /> },
      { path: 'settings', element: <PlaceholderScreen title="Settings" /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
