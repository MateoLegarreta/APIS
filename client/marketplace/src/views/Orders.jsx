import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../redux/orderSlice'
import { precio } from '../utils/precio'

// "Mis pedidos": lista las compras del usuario logueado (GET /orders).
// El back ya las devuelve de la mas nueva a la mas vieja
function Orders() {
    const dispatch = useDispatch();
    const { items: pedidos, loading, error, cargado } = useSelector((state) => state.orders);

    // Se piden una sola vez. Los pedidos solo cambian cuando el usuario compra,
    // y en ese caso el slice agrega el nuevo solo (ver checkout en orderSlice)
    useEffect(() => {
        if (!cargado && !loading) {
            dispatch(fetchOrders())
        }
    }, [dispatch])

    if (error) return <p className="mensaje-error">{error}</p>
    if (loading || !cargado) return <p>Cargando pedidos...</p>
    if (pedidos.length === 0) {
        return (
            <p className="mensaje-vacio">
                Todavia no hiciste ningun pedido. <Link to="/catalogo">Ir al catálogo</Link>
            </p>
        )
    }

    return (
        <div>
            <h1 className="titulo-seccion">Mis pedidos</h1>

            {pedidos.map(pedido => {
                // Cantidad total de unidades, no de lineas distintas
                const unidades = pedido.items.reduce((suma, item) => suma + item.quantity, 0);

                return (
                    <div key={pedido.id} className="pedido-fila">
                        <div>
                            <strong>Pedido #{pedido.id}</strong>
                            <p className="pedido-fecha">{new Date(pedido.date).toLocaleString('es-AR')}</p>
                            <p className="pedido-fecha">
                                {unidades} {unidades === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>

                        <div className="pedido-derecha">
                            <span className="pedido-total">{precio(pedido.total)}</span>
                            <Link to={'/pedidos/' + pedido.id} className="boton boton-secundario">
                                Ver detalle
                            </Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Orders
