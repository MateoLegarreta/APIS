import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Envuelve las pantallas que piden sesion. Si no hay sesion, manda al login
// en vez de mostrar la pantalla (replace evita que "atras" vuelva a la ruta bloqueada)
function RutaProtegida({ children }) {
    const logueado = useSelector((state) => state.auth.token !== null)

    if (!logueado) return <Navigate to="/login" replace />

    return children
}

export default RutaProtegida
