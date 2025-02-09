import './App.css'
import {Route, Routes} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import EventDiscovery from './pages/EventDiscovery'
import Layout from './components/Layout'

const App = () => {
  return (
    <AuthProvider>
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
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
