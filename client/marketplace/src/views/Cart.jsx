import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Foto from '../components/Foto'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../redux/cartSlice'
import { precio } from '../utils/precio'

// Carrito del usuario logueado. El carrito vive en el backend, y en el front se
// guarda en el store: cada accion es un pedido y la respuesta trae el carrito
// ya actualizado, que reemplaza al del store
function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total, loading, error, cargado } = useSelector((state) => state.cart);

    // Error de una accion (cambiar cantidad, quitar, vaciar). Va aparte de "error"
    // para que, si falla una accion, el carrito siga a la vista
    const [errorAccion, setErrorAccion] = useState('');

    // Mientras hay un pedido en curso se deshabilitan los botones,
    // asi no se mandan dos pedidos seguidos por un doble click
    const [ocupado, setOcupado] = useState(false);

    // Normalmente la barra ya lo pidio al iniciar sesion: solo se pide si no esta
    useEffect(() => {
        if (!cargado && !loading) {
            dispatch(fetchCart())
        }
    }, [dispatch])

    // Las acciones del carrito hacen lo mismo: despachar, esperar y manejar
    // el error. El slice ya guarda el carrito nuevo, aca solo va lo de pantalla.
    // Los mensajes de error (409 = sin stock, etc.) ya vienen traducidos del slice
    function ejecutar(accion) {
        setErrorAccion('');
        setOcupado(true);
        dispatch(accion)
            .unwrap()
            .catch(error => setErrorAccion(error.message))
            .finally(() => setOcupado(false));
    }

    // Cambia las unidades de una linea
    function cambiarCantidad(productId, cantidad) {
        if (cantidad < 1) return;
        ejecutar(updateCartItem({ productId, quantity: cantidad }));
    }

    // Saca una linea del carrito
    function quitarProducto(productId) {
        ejecutar(removeCartItem(productId));
    }

    // Borra todas las lineas de una
    function vaciarCarrito() {
        if (!window.confirm('¿Seguro que queres vaciar el carrito?')) return;
        ejecutar(clearCart());
    }

 
    

    // El error va primero: si el pedido fallo, "cargado" queda en false
    // y la pantalla se quedaria en "Cargando..." para siempre
    if (error) return <p className="mensaje-error">{error}</p>
    if (loading || !cargado) return <p>Cargando carrito...</p>
    if (items.length === 0) {
        return (
            <p className="mensaje-vacio">
                Tu carrito está vacío. <Link to="/catalogo">Ver el catálogo</Link>
            </p>
        )
    }

    return (
        <>
            <h1 className="carrito-titulo">Mi carrito</h1>

            {errorAccion && <p className="mensaje-error">{errorAccion}</p>}

            <div className="carrito">

                <div>
                    {items.map(item => (
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
                                <span className="carrito-subtotal">{precio(item.subtotal)}</span>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="resumen">
                    <div className="resumen-fila">
                        <span>Productos</span>
                        <span>{items.length}</span>
                    </div>

                    <div className="resumen-total">
                        <span>Total</span>
                        <span>{precio(total)}</span>
                    </div>

                    <button
                        className="boton"
                        onClick={() => navigate('/pago')}
                        disabled={ocupado}>
                        Ir a pagar
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
