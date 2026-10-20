import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Foto from '../components/Foto'
import { api } from '../services/api'

// Muestra todos los datos de un producto, que lo pide al backend por su id
function ProductDetail() {
    const { id } = useParams()
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [agregando, setAgregado] = useState(false)
    const [cantidad, setCantidad] = useState(1)

    useEffect(() => {
        setError('')
        setProducto(null)

        fetch('/products/' + id)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    if (response.status === 404) {
                        throw new Error('El producto no existe')
                    }
                    throw new Error('Error al cargar el producto')
                }
            })
            .then(data => setProducto(data))
            .catch(error => {
                setError(error.message)
                console.error(error)
            })
    }, [id])

    function handleAgregar(){
        setMensaje('')
        setAgregado(true)
        api('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId: producto.id, quantity: cantidad })
        })
        .then(() => setMensaje('Producto agregado al carrito'))
        .catch(error => setMensaje(error.message))
        .finally(() => setAgregado(false))
    }

    if (error) {
        return (
            <>
                <p>{error}</p>
                <Link to="/">Volver al catálogo</Link>
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
                <Link to="/">Todos los productos</Link> / {producto.name}
            </p>

            <div className="detalle">
                <div className="detalle-foto">
                    <Foto imageId={producto.imageId} alt={producto.name} tamanio={360} />
                </div>

                <div>
                    <h1 className="detalle-titulo">{producto.name}</h1>

                    {tieneDescuento && (
                        <p>
                            <s className="detalle-precio-viejo">${producto.price}</s>{' '}
                            <span className="etiqueta-descuento">-{producto.discountPercentage}%</span>
                        </p>
                    )}

                    <p className="detalle-precio">${producto.finalPrice}</p>

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

                    {mensaje && <p className="mensaje-ok">{mensaje}</p>}

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
