import { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../redux/orderSlice'
import Foto from '../components/Foto'
import { precio } from '../utils/precio'

// Detalle de un pedido. El precio de cada linea es el que se pago ese dia,
// no el actual del producto
function OrderDetail() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    // Cart.jsx manda este flag al terminar el checkout, para mostrar el cartel de exito
    const recienCreado = location.state?.recienCreado === true;

    // El pedido casi siempre ya esta en el store: en "mis pedidos", en las
    // ventas (si es el admin) o como detalle (recien comprado). Solo si no
    // esta en ningun lado se pide al back. El id de la URL es texto: por eso String()
    const pedido = useSelector((state) => {
        const mismoId = (p) => String(p.id) === id;
        const { items, ventas, detalle } = state.orders;
        return items.find(mismoId) ?? ventas.find(mismoId) ?? (detalle && mismoId(detalle) ? detalle : null);
    });
    const detalleError = useSelector((state) => state.orders.detalleError);
    const error = pedido ? null : detalleError;

    useEffect(() => {
        if (!pedido) {
            dispatch(fetchOrderById(id))
        }
    }, [id, dispatch])

    if (error) {
        return (
            <>
                <p className="mensaje-error">{error}</p>
                <Link to="/pedidos">Volver a mis pedidos</Link>
            </>
        )
    }
    if (!pedido) return <p>Cargando pedido...</p>

    return (
        <div>
            <p className="breadcrumb">
                <Link to="/pedidos">Mis pedidos</Link> / Pedido #{pedido.id}
            </p>

            {recienCreado && <p className="mensaje-ok">¡Compra confirmada! Gracias por tu pedido.</p>}

            <h1 className="titulo-seccion">Pedido #{pedido.id}</h1>
            <p className="subtitulo-seccion">{new Date(pedido.date).toLocaleString('es-AR')}</p>

            {pedido.items.map(item => (
                <div key={item.productId} className="pedido-linea">
                    <Foto imageId={item.imageId} alt={item.name} tamanio={72} />

                    <div>
                        <strong>{item.name}</strong>
                        <p className="pedido-fecha">
                            {item.quantity} x {precio(item.unitPrice)}
                        </p>
                    </div>

                    <span className="pedido-total">{precio(item.subtotal)}</span>
                </div>
            ))}

            <div className="resumen-total">
                <span>Total</span>
                <span>{precio(pedido.total)}</span>
            </div>
        </div>
    )
}

export default OrderDetail
