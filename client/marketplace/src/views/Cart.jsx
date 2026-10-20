import { api } from '../services/api';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Foto from '../components/Foto'


function Cart() {
    const [carrito, setCarrito] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [operando, setOperando] = useState(false);

    useEffect(() => {
       api('/cart')
        .then(data => setCarrito(data))
        .catch(error => setError(error.message))
        .finally(() => setCargando(false));
        }, [])
    // Saca un producto del carrito. El backend devuelve el carrito completo
    // ya recalculado, asi que alcanza con reemplazar el estado
    function handleEliminarItem(productId) {
        setError('');
        setOperando(true);
        api('/cart/items/' + productId, {method: 'DELETE'})
        .then(data => setCarrito(data))
        .catch(error => setError(error.message))
        .finally(() => setOperando(false));
    }

    function handleCantidad(productId, nuevaCantidad) {
        if (nuevaCantidad < 1) return
        setError('')
        setOperando(true)
        api('/cart/items/' + productId, {
            method: 'PUT',
            body: JSON.stringify({ quantity: nuevaCantidad })
        })
        .then(data => setCarrito(data))
        .catch(error => setError(error.message))
        .finally(() => setOperando(false))
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
            <h1 className="carrito-titulo">Vista previa de la orden</h1>

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
                                    onClick={() => handleEliminarItem(item.productId)}
                                    disabled={operando}>
                                    Eliminar
                                </button>
                            </div>

                            <div className="carrito-derecha">
                                <div className="cantidad">
                                    <button
                                        onClick={() => handleCantidad(item.productId, item.quantity - 1)}
                                        disabled={operando || item.quantity <= 1}>
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleCantidad(item.productId, item.quantity + 1)}
                                        disabled={operando}>
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

                    <p className="resumen-separador">o</p>
                    <Link to="/" className="resumen-volver">Seguir comprando</Link>
                </div>

            </div>
        </>
    )
}

export default Cart;
