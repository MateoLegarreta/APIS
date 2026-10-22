import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'     
import Catalogo from './views/Catalogo'
import Login from './views/Login'
import Register from './views/Register'
import ProductDetail from './views/ProductDetail'
import Cart from './views/Cart'
import Orders from './views/Orders'
import OrderDetail from './views/OrderDetail'

function App() {
  return (
    <>                                               
      <Navigation />
      <main className="contenido">
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/pedidos/:id" element={<OrderDetail />} />
      </Routes>
      </main>
    </>                                              
  )
}

export default App