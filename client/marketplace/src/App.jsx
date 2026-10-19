import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'     
import Catalogo from './views/Catalogo'
import Login from './views/Login'
import Register from './views/Register'
import ProductDetail from './views/ProductDetail'
import Cart from './views/Cart'

function App() {
  return (
    <>                                               
      <Navigation />                                 
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>
    </>                                              
  )
}

export default App