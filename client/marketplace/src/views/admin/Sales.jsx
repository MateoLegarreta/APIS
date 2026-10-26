import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import MenuAdmin from '../../components/MenuAdmin';


// Ventas del local: todos los pedidos de todos los clientes (GET /orders/all).
// Es la version admin de "Mis pedidos", y agrega quien compro
function Sales() {
    const [pedidos, setPedidos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api('/orders/all')
            .then(data => setPedidos(data))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false));
    }, [])

    if (cargando) return <p>Cargando ventas...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (pedidos.length === 0) {
        return <p className="mensaje-vacio">Todavia no hay ventas registradas.</p>
    }

    return (
        <div>
            <MenuAdmin/>
            <h1 className="titulo-seccion">Ventas del local</h1>

            {pedidos.map(pedido => {
                // Cantidad total de unidades, no de lineas distintas
                const unidades = pedido.items.reduce((suma, item) => suma + item.quantity, 0);

                return (
                    <div key={pedido.id} className="pedido-fila">
                        <div>
                            <strong>Pedido #{pedido.id}</strong>
                            <p className="pedido-fecha">{new Date(pedido.date).toLocaleString('es-AR')}</p>
                            <p className="pedido-fecha">
                                {pedido.buyerName || 'Sin nombre'} ({pedido.buyerEmail})
                            </p>
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

export default Sales