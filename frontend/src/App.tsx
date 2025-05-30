import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Home } from './pages/Homepage'
import { AdminDashboard } from './pages/AdminDashboard'
import { OwnerDashboard } from './pages/Ownerdashboard'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />}></Route>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='/ownerdash' element={<OwnerDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
