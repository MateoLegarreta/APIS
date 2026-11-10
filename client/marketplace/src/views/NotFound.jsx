import { Link } from 'react-router-dom'

// Se muestra cuando la URL no coincide con ninguna ruta (path="*" en App.jsx)
function NotFound() {
    return (
        <div>
            <h1 className="titulo-seccion">Página no encontrada</h1>
            <p className="subtitulo-seccion">La dirección que escribiste no existe.</p>
            <p className="mensaje-vacio">
                <Link to="/" className="boton">Volver al inicio</Link>
            </p>
        </div>
    )
}

export default NotFound
