import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'     
import Catalogo from './components/Catalogo'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  return (
    <>                                               
      <Navigation />                                 
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>                                              
  )
}

export default App