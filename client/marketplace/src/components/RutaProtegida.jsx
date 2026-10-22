import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve las pantallas que piden sesion. Si no hay sesion, manda al login
// en vez de mostrar la pantalla (replace evita que "atras" vuelva a la ruta bloqueada)
function RutaProtegida({ children }) {
    const { logueado } = useAuth()

    if (!logueado) return <Navigate to="/login" replace />

    return children
}

export default RutaProtegida
