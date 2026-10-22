import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

// "Mis pedidos": lista las compras del usuario logueado (GET /orders).
// El back ya las devuelve de la mas nueva a la mas vieja
function Orders() {
    const [pedidos, setPedidos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api('/orders')
            .then(data => setPedidos(data))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false));
    }, [])

    if (cargando) return <p>Cargando pedidos...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (pedidos.length === 0) {
        return (
            <p className="mensaje-vacio">
                Todavia no hiciste ningun pedido. <Link to="/">Ir al catalogo</Link>
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
                            <span className="pedido-total">${pedido.total}</span>
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
