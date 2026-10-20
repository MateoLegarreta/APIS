import { Link } from 'react-router-dom'
import Foto from './Foto'

// Recibe el producto entero en un solo prop. Con seis datos distintos, una
// lista de props sueltos se vuelve larga y hay que repetirla en el catalogo
const CardProduct = ({ producto }) => {
    const tieneDescuento = producto.discountPercentage > 0
    const hayStock = producto.stock > 0

    return (
        <div className="card">
            <div className="card-foto">
                <Foto imageId={producto.imageId} alt={producto.name} tamanio={160} />
            </div>

            <div className="card-cuerpo">
                {/* El ? evita reventar si por algun motivo el producto vino sin categoria */}
                <span className="card-categoria">{producto.category?.description}</span>

                <h2 className="card-nombre">{producto.name}</h2>

                {/* El precio tachado solo tiene sentido si hay descuento */}
                {tieneDescuento && (
                    <p>
                        <s className="card-precio-viejo">${producto.price}</s>{' '}
                        <span className="etiqueta-descuento">-{producto.discountPercentage}%</span>
                    </p>
                )}

                <p className="card-precio">${producto.finalPrice}</p>

                <p className={hayStock ? 'stock' : 'sin-stock'}>
                    {hayStock ? 'Stock: ' + producto.stock : 'Sin stock'}
                </p>

                <div className="card-accion">
                    <Link to={'/producto/' + producto.id} className="boton">Ver detalle</Link>
                </div>
            </div>
        </div>
    )
}

export default CardProduct
