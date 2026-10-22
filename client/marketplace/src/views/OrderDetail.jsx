import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import Foto from '../components/Foto'

// Detalle de un pedido (GET /orders/{id}). El precio de cada linea es el que
// se pago ese dia, no el actual del producto
function OrderDetail() {
    const { id } = useParams();
    const location = useLocation();

    // Cart.jsx manda este flag al terminar el checkout, para mostrar el cartel de exito
    const recienCreado = location.state?.recienCreado === true;

    const [pedido, setPedido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setCargando(true);
        setError('');
        api('/orders/' + id)
            .then(data => setPedido(data))
            .catch(error => setError(traducirError(error.message)))
            .finally(() => setCargando(false));
    }, [id])

    function traducirError(mensaje) {
        if (mensaje === 'Error 404') return 'Ese pedido no existe';
        return mensaje;
    }

    if (cargando) return <p>Cargando pedido...</p>
    if (error) {
        return (
            <>
                <p className="mensaje-error">{error}</p>
                <Link to="/pedidos">Volver a mis pedidos</Link>
            </>
        )
    }

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
                            {item.quantity} x ${item.unitPrice}
                        </p>
                    </div>

                    <span className="pedido-total">${item.subtotal}</span>
                </div>
            ))}

            <div className="resumen-total">
                <span>Total</span>
                <span>${pedido.total}</span>
            </div>
        </div>
    )
}

export default OrderDetail
