import { Link } from 'react-router-dom'

// Se muestra cuando la URL no coincide con ninguna ruta (path="*" en App.jsx)
function NotFound() {
    return (
        <div>
            <h1 className="titulo-seccion">Pagina no encontrada</h1>
            <p className="subtitulo-seccion">La direccion que escribiste no existe.</p>
            <p className="mensaje-vacio">
                <Link to="/" className="boton">Volver al catalogo</Link>
            </p>
        </div>
    )
}

export default NotFound
