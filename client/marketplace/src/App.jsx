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
import NotFound from './views/NotFound'
import RutaProtegida from './components/RutaProtegida'
import Footer from './components/Footer'
import RutaAdmin from './components/RutaAdmin'
import Products from './views/admin/Products'
import Categories from './views/admin/Categories'
import Sales from './views/admin/Sales'
import Users from './views/admin/Users'

// Mapa de la aplicacion: a cada direccion le corresponde una pantalla.
// La barra de navegacion y el pie van fuera de Routes, asi se ven siempre
function App() {
  return (
    <>                                               
      <Navigation />
      <main className="contenido">
      <Routes>
        {/* Publicas: no hace falta sesion */}
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        {/* Solo con sesion iniciada: RutaProtegida manda al login si no hay token */}
        <Route path="/carrito" element={<RutaProtegida><Cart /></RutaProtegida>} />
        <Route path="/pedidos" element={<RutaProtegida><Orders /></RutaProtegida>} />
        <Route path="/pedidos/:id" element={<RutaProtegida><OrderDetail /></RutaProtegida>} />
        {/* Cualquier direccion que no coincida con las de arriba */}
        <Route path="*" element={<NotFound />} />
        {/* Panel de administracion: RutaAdmin exige que el rol sea ADMIN */}
        <Route path="/admin/products" element={<RutaAdmin><Products /></RutaAdmin>} />
        <Route path="/admin/categories" element={<RutaAdmin><Categories /></RutaAdmin>} />
        <Route path="/admin/sales" element={<RutaAdmin><Sales /></RutaAdmin>} />
        <Route path="/admin/users" element={<RutaAdmin><Users /></RutaAdmin>} />
      </Routes>
      </main>
      <Footer />
    </>                                              
  )
}

export default App