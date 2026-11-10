import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Foto from '../components/Foto'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../redux/productSlice'
import { useAgregarAlCarrito } from '../hooks/useAgregarAlCarrito'
import { precio } from '../utils/precio'

// Muestra todos los datos de un producto, que lo pide al backend por su id
function ProductDetail() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [mensaje, setMensaje] = useState('')
    const [agregando, setAgregado] = useState(false)
    const [cantidad, setCantidad] = useState(1)
    const [esError, setEsError] = useState(false)
    const agregar = useAgregarAlCarrito()

    // Si se llego desde el catalogo o el inicio, el producto ya esta en el store
    // y no hace falta pedirlo. Si no, se usa el que se pidio suelto por id.
    // El id de la URL es texto y el del producto es numero: por eso String()
    const delCatalogo = useSelector((state) =>
        state.products.items.find((p) => String(p.id) === id)
        ?? state.products.todos.find((p) => String(p.id) === id))
    const detalle = useSelector((state) => state.products.detalle)
    const detalleError = useSelector((state) => state.products.detalleError)

    const producto = delCatalogo ?? (String(detalle?.id) === id ? detalle : null)
    const error = delCatalogo ? null : detalleError

    useEffect(() => {
        if (!producto) {
            dispatch(fetchProductById(id))
        }
    }, [id, dispatch])

    // Agrega el producto al carrito con la cantidad elegida. El back devuelve el
    // carrito actualizado y el slice lo guarda, asi el contador de la barra
    // cambia solo sin volver a pedir el carrito.
    // Si no hay sesion, el hook manda al login con un aviso
    function handleAgregar(){
        setMensaje('')
        setAgregado(true)
        agregar(producto.id, cantidad)
            .then((agregado) => {
                if (!agregado) return
                setEsError(false)
                setMensaje('Agregado al carrito.')
            })
            .catch(error => {
                setEsError(true)
                setMensaje(error.message)
            })
            .finally(() => setAgregado(false))
    }

    if (error) {
        return (
            <>
                <p>{error}</p>
                <Link to="/catalogo">Volver al catálogo</Link>
            </>
        )
    }

    if (!producto) {
        return <p>Cargando...</p>
    }

    const tieneDescuento = producto.discountPercentage > 0
    const hayStock = producto.stock > 0

    return (
        <>
            <p className="breadcrumb">
                <Link to="/catalogo">Catálogo</Link> / {producto.name}
            </p>

            <div className="detalle">
                <div className="detalle-foto">
                    <Foto imageId={producto.imageId} alt={producto.name} tamanio={360} />
                </div>

                <div>
                    <h1 className="detalle-titulo">{producto.name}</h1>

                    {tieneDescuento && (
                        <p>
                            <s className="detalle-precio-viejo">{precio(producto.price)}</s>{' '}
                            <span className="etiqueta-descuento">-{producto.discountPercentage}%</span>
                        </p>
                    )}

                    <p className="detalle-precio">{precio(producto.finalPrice)}</p>

                    <div className="detalle-acciones">
                        <div className="cantidad">
                            {/* No baja de 1: el backend rechaza una cantidad de 0 con un 400 */}
                            <button
                                type="button"
                                onClick={() => setCantidad(cantidad - 1)}
                                disabled={cantidad <= 1}>
                                −
                            </button>
                            <span>{cantidad}</span>
                            {/* Ni pasa del stock, asi no se manda un pedido que va a dar 409 */}
                            <button
                                type="button"
                                onClick={() => setCantidad(cantidad + 1)}
                                disabled={cantidad >= producto.stock}>
                                +
                            </button>
                        </div>

                        <button
                            className="boton"
                            onClick={handleAgregar}
                            disabled={agregando || !hayStock}>
                            {agregando ? 'Agregando...' : 'Agregar al carrito'}
                        </button>
                    </div>

                    {mensaje && (
                        <p className={esError ? 'mensaje-error' : 'mensaje-ok'}>
                            {mensaje} {!esError && <Link to="/carrito">Ver el carrito</Link>}
                        </p>
                    )}

                    <hr className="detalle-separador" />

                    <p className="detalle-dato">
                        <strong>Categoría:</strong> {producto.category?.description}
                    </p>
                    <p className="detalle-dato">
                        <strong>Disponibilidad:</strong>{' '}
                        {hayStock
                            ? producto.stock + ' unidades en stock'
                            : <span className="sin-stock">Sin stock</span>}
                    </p>

                    <p className="detalle-descripcion">{producto.description}</p>
                </div>
            </div>
        </>
    )

}


export default ProductDetail
