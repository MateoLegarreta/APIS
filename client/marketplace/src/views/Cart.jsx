import { api } from '../services/api';
import { useState, useEffect } from 'react'


function Cart() {
    const [carrito, setCarrito] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
       api('/cart')
        .then(data => setCarrito(data))
        .catch(error => setError(error.message))
        .finally(() => setCargando(false));
        }, [])
    if(cargando) return <p>Cargando carrito...</p>
    if(error) return <p> {error}</p>
    if (carrito.items.length === 0) return <p>El carrito esta vacio</p>

    return(
        <div>
            <h1> Mi carrito</h1>

            {carrito.items.map(item => (
                <div key={item.productId}>
                    <h3>{item.name}</h3>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio unitario: ${item.unitPrice}</p>
                    <p>Subtotal: ${item.subtotal}</p>
                    </div>
            ))}

            <h2>Total: ${carrito.total}</h2>
        </div>
        
    )
}

export default Cart;
