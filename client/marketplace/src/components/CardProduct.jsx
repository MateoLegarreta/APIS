import { useState } from 'react'
import { Link } from 'react-router-dom'
import Foto from './Foto'
import { IconoCarrito, IconoCheck } from './Iconos'
import { useAgregarAlCarrito } from '../hooks/useAgregarAlCarrito'
import { precio } from '../utils/precio'

// Recibe el producto entero en un solo prop. Con seis datos distintos, una
// lista de props sueltos se vuelve larga y hay que repetirla en el catalogo
const CardProduct = ({ producto }) => {
    const tieneDescuento = producto.discountPercentage > 0
    const hayStock = producto.stock > 0
    const agregar = useAgregarAlCarrito()

    // 'listo' muestra un check un momento despues de agregar
    const [estado, setEstado] = useState('')
    const [error, setError] = useState('')

    // Agrega una unidad sin tener que entrar al detalle.
    // Si no hay sesion, el hook manda al login
    function handleAgregar() {
        setError('')
        setEstado('agregando')
        agregar(producto.id, 1)
            .then((agregado) => {
                if (!agregado) return
                setEstado('listo')
                setTimeout(() => setEstado(''), 1500)
            })
            .catch((fallo) => {
                setEstado('')
                setError(fallo.message)
            })
    }

    return (
        <article className="card">
            {/* Foto y nombre llevan al detalle */}
            <Link to={'/producto/' + producto.id} className="card-enlace">
                <div className="card-foto">
                    <Foto imageId={producto.imageId} alt={producto.name} tamanio={200} />
                    {tieneDescuento && (
                        <span className="etiqueta-descuento card-descuento">-{producto.discountPercentage}%</span>
                    )}
                </div>

                <div className="card-cuerpo">
                    {/* El ? evita reventar si por algun motivo el producto vino sin categoria */}
                    <span className="card-categoria">{producto.category?.description}</span>
                    <h3 className="card-nombre">{producto.name}</h3>
                </div>
            </Link>

            <div className="card-pie">
                <div>
                    {/* El precio tachado solo tiene sentido si hay descuento */}
                    {tieneDescuento && <s className="card-precio-viejo">{precio(producto.price)}</s>}
                    <p className="card-precio">{precio(producto.finalPrice)}</p>
                    {!hayStock && <p className="sin-stock">Sin stock</p>}
                </div>

                <button
                    type="button"
                    className={'card-agregar' + (estado === 'listo' ? ' listo' : '')}
                    onClick={handleAgregar}
                    disabled={!hayStock || estado === 'agregando'}
                    aria-label={estado === 'listo' ? 'Agregado al carrito' : 'Agregar ' + producto.name + ' al carrito'}>
                    {estado === 'listo' ? <IconoCheck tamanio={20} /> : <IconoCarrito tamanio={20} />}
                </button>
            </div>

            {error && <p className="mensaje-error card-error">{error}</p>}
        </article>
    )
}

export default CardProduct
