import { Link } from 'react-router-dom'
import Foto from './Foto'

const CardProduct = ({ id, nombre, precio, imageId }) => {
    return (
        <div>
            <Foto imageId={imageId} alt={nombre} tamanio={160} />
            <h2>{nombre}</h2>
            <p>Precio: ${precio}</p>
            <Link to={'/producto/' + id}>Ver detalle</Link>
        </div>
    )
}

export default CardProduct
