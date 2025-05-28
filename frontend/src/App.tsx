import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Home } from './pages/Homepage'


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />}></Route>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
