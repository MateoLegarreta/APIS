import { api } from '../services/api';
import { useState, useEffect } from 'react'

function Cart() {
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
        // El back rechaza cantidades menores a 1; para sacar el producto esta el boton Quitar
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

    if (cargando) return <p>Cargando carrito...</p>
    if (error) return <p>{error}</p>
    if (carrito.items.length === 0) return <p>El carrito esta vacio</p>

    return (
        <div>
            <h1>Mi carrito</h1>

            {errorAccion && <p>{errorAccion}</p>}

            {carrito.items.map(item => (
                <div key={item.productId}>
                    <h3>{item.name}</h3>
                    <p>Precio unitario: ${item.unitPrice}</p>

                    <p>
                        Cantidad:
                        <button onClick={() => cambiarCantidad(item.productId, item.quantity - 1)} disabled={ocupado || item.quantity <= 1}>
                            -
                        </button>
                        {item.quantity}
                        <button onClick={() => cambiarCantidad(item.productId, item.quantity + 1)} disabled={ocupado}>
                            +
                        </button>
                    </p>

                    <p>Subtotal: ${item.subtotal}</p>

                    <button onClick={() => quitarProducto(item.productId)} disabled={ocupado}>
                        Quitar
                    </button>
                </div>
            ))}

            <h2>Total: ${carrito.total}</h2>

            <button onClick={vaciarCarrito} disabled={ocupado}>Vaciar carrito</button>
        </div>
    )
}

export default Cart;