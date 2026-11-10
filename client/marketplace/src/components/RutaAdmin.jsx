import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Envuelve las pantallas del panel. Tres casos: sin sesion va al login, con sesion
// pero sin permisos ve un cartel, y el admin ve la pantalla.
// Esto es solo la vista: el permiso real lo controla el back con @PreAuthorize
function RutaAdmin({ children }) {
    const logueado = useSelector((state) => state.auth.token !== null)
    const esAdmin = useSelector((state) => state.auth.rol === 'ADMIN')

    if (!logueado) return <Navigate to="/login" replace />
    if (!esAdmin) return <p className="mensaje-vacio">Acceso denegado</p>
    return children
}

export default RutaAdmin
