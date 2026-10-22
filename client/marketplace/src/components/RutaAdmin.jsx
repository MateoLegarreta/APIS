import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RutaAdmin({ children }) {
const {logueado, esAdmin} = useAuth()
if (!logueado) return <Navigate to="/login" replace />
if (!esAdmin) return <p className="mensaje-vacio">Acceso denegado</p>
return children
}

export default RutaAdmin
