import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navigation() {
  const { logueado, logout, esAdmin } = useAuth()
  const navigate = useNavigate()

  // Cierra la sesion y lleva al login
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-interior">
        <Link to='/' className="navbar-marca">La Bodega</Link>

        <ul className="navbar-links">
            <li>
                <Link to='/'>Catálogo</Link>
            </li>
            {/* El admin no compra: administra. Por eso no ve carrito ni pedidos */}
            {logueado && !esAdmin && (
              <li>
                <Link to='/carrito'>Mi carrito</Link>
              </li>
            )}
            {logueado && !esAdmin && (
              <li>
                <Link to='/pedidos'>Mis pedidos</Link>
              </li>
            )}
            {esAdmin && (
              <li>
                <Link to='/admin/products'>Panel</Link>
              </li>
            )}
            {!logueado && (
              <li>
                <Link to='/register'>Registrarse</Link>
              </li>
            )}
            {/* Las acciones de cuenta van siempre al final */}
            <li>
                {logueado
                  ? <button onClick={handleLogout}>Cerrar sesión</button>
                  : <Link to='/login'>Iniciar sesión</Link>}
            </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
