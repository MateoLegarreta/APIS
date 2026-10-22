import { api } from '../services/api';
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Foto from '../components/Foto'

function Cart() {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // Error de una accion (cambiar cantidad, quitar, vaciar). Va aparte de "error"
    // para que, si falla una accion, el carrito siga a la vista
    const [errorAccion, setErrorAccion] = useState('');

    // Mientras hay un pedido en curso se deshabilitan los botones,
    // asi no se mandan dos pedidos seguidos por un doble click
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        api('/cart')
            .then(data => setCarrito(data))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false));
    }, [])

    // El back responde 409 cuando la cantidad pedida supera el stock,
    // pero api() solo devuelve "Error 409", asi que lo traducimos aca
    function traducirError(mensaje) {
        if (mensaje === 'Error 409') return 'No hay stock suficiente para esa cantidad';
        if (mensaje === 'Error 400') return 'La cantidad indicada es invalida';
        return mensaje;
    }

    // En el checkout los mismos codigos significan otra cosa:
    // 409 = algun producto se quedo sin stock, 400 = el carrito esta vacio
    function traducirErrorCheckout(mensaje) {
        if (mensaje === 'Error 409') return 'Algun producto ya no tiene stock suficiente. Revisa las cantidades del carrito';
        if (mensaje === 'Error 400') return 'El carrito esta vacio';
        return mensaje;
    }

    function ejecutar(ruta, opciones, alTerminar) {
        setErrorAccion('');
        setOcupado(true);
        api(ruta, opciones)
            .then(data => {
                if (alTerminar) alTerminar(data);
                else setCarrito(data);
            })
            .catch(error => setErrorAccion(traducirError(error.message)))
            .finally(() => setOcupado(false));
    }

    function cambiarCantidad(productId, cantidad) {
        if (cantidad < 1) return;
        ejecutar('/cart/items/' + productId, {
            method: 'PUT',
            body: JSON.stringify({ quantity: cantidad })
        });
    }

    function quitarProducto(productId) {
        ejecutar('/cart/items/' + productId, { method: 'DELETE' });
    }

    function vaciarCarrito() {
        if (!window.confirm('¿Seguro que queres vaciar el carrito?')) return;
        ejecutar('/cart', { method: 'DELETE' }, () => setCarrito({ items: [], total: 0 }));
    }

    // Confirma la compra: POST /cart/checkout crea el pedido y vacia el carrito.
    // Si sale bien se va al detalle del pedido recien creado
    function confirmarCompra() {
        setErrorAccion('');
        setOcupado(true);
        api('/cart/checkout', { method: 'POST' })
            .then(pedido => navigate('/pedidos/' + pedido.id, { state: { recienCreado: true } }))
            .catch(error => {
                setErrorAccion(traducirErrorCheckout(error.message));
                setOcupado(false);
            });
    }

    if (cargando) return <p>Cargando carrito...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (carrito.items.length === 0) {
        return (
            <p className="mensaje-vacio">
                Tu carrito está vacío. <Link to="/">Ver el catálogo</Link>
            </p>
        )
    }

    return (
        <>
            <h1 className="carrito-titulo">Mi carrito</h1>

            {errorAccion && <p className="mensaje-error">{errorAccion}</p>}

            <div className="carrito">

                <div>
                    {carrito.items.map(item => (
                        <div className="carrito-linea" key={item.productId}>

                            <div className="carrito-foto">
                                <Foto imageId={item.imageId} alt={item.name} tamanio={56} />
                            </div>

                            <div>
                                <h3 className="carrito-nombre">{item.name}</h3>
                                <button
                                    className="carrito-eliminar"
                                    onClick={() => quitarProducto(item.productId)}
                                    disabled={ocupado}>
                                    Quitar
                                </button>
                            </div>

                            <div className="carrito-derecha">
                                <div className="cantidad">
                                    <button
                                        onClick={() => cambiarCantidad(item.productId, item.quantity - 1)}
                                        disabled={ocupado || item.quantity <= 1}>
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => cambiarCantidad(item.productId, item.quantity + 1)}
                                        disabled={ocupado}>
                                        +
                                    </button>
                                </div>
                                <span className="carrito-subtotal">${item.subtotal}</span>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="resumen">
                    <div className="resumen-fila">
                        <span>Productos</span>
                        <span>{carrito.items.length}</span>
                    </div>

                    <div className="resumen-total">
                        <span>Total</span>
                        <span>${carrito.total}</span>
                    </div>

                    <button
                        className="boton"
                        onClick={confirmarCompra}
                        disabled={ocupado}>
                        Confirmar compra
                    </button>

                    <p className="resumen-separador">o</p>

                    <button
                        className="carrito-eliminar resumen-volver"
                        onClick={vaciarCarrito}
                        disabled={ocupado}>
                        Vaciar carrito
                    </button>
                </div>

            </div>
        </>
    )
}

export default Cart;
