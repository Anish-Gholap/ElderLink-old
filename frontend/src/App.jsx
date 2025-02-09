import './App.css'
import {Route, Routes} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import {EventsProvider} from './contexts/EventsContext'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import EventDiscovery from './pages/EventDiscovery'
import Layout from './components/Layout'
import ManageEvents from './pages/ManageEvents'

const App = () => {
  return (
    <AuthProvider>
      <EventsProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />

            {/* Protected Route for Pages only accessible after login */}
            <Route path='/event-discovery' element= {
              <ProtectedRoute>
                <EventDiscovery />
              </ProtectedRoute>
            } />
            <Route path='/events-management' element= {
              <ProtectedRoute>
                <ManageEvents />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </EventsProvider>
    </AuthProvider>
  )
}

export default App
