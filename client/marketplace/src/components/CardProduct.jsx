import { Link } from 'react-router-dom'
import Foto from './Foto'

// Recibe el producto entero en un solo prop. Con seis datos distintos, una
// lista de props sueltos se vuelve larga y hay que repetirla en el catalogo
const CardProduct = ({ producto }) => {
    const tieneDescuento = producto.discountPercentage > 0
    const hayStock = producto.stock > 0

    return (
        <div>
            <Foto imageId={producto.imageId} alt={producto.name} tamanio={160} />

            <h2>{producto.name}</h2>

            {/* El ? evita reventar si por algun motivo el producto vino sin categoria */}
            <p>{producto.category?.description}</p>

            {/* El precio tachado solo tiene sentido si hay descuento */}
            {tieneDescuento && (
                <p>
                    <s>${producto.price}</s> {producto.discountPercentage}% de descuento
                </p>
            )}

            <p>Precio: ${producto.finalPrice}</p>

            <p>{hayStock ? 'Stock: ' + producto.stock : 'Sin stock'}</p>

            <Link to={'/producto/' + producto.id}>Ver detalle</Link>
        </div>
    )
}

export default CardProduct
