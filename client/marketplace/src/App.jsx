import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'     
import Catalogo from './components/Catalogo'
import Login from './components/Login'
import Register from './components/Register'
import ProductDetail from './components/ProductDetail'

function App() {
  return (
    <>                                               
      <Navigation />                                 
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </>                                              
  )
}

export default App