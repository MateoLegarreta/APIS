import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navigation() {
  const { logueado, logout } = useAuth()
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
            {logueado && (
              <li>
                <Link to='/carrito'>Mi carrito</Link>
              </li>
            )}
            {!logueado && (
              <li>
                <Link to='/register'>Registrarse</Link>
              </li>
            )}
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
