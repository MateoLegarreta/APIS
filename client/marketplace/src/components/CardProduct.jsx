import { Link } from 'react-router-dom'

const CardProduct = ({ id, nombre, precio }) => {
    return (
        <div>
            <h2>{nombre}</h2>
            <p>Precio: ${precio}</p>
            <Link to={'/producto/' + id}>Ver detalle</Link>
        </div>
    )
}

export default CardProduct
