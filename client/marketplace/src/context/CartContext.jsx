import { createContext, useContext, useState } from 'react'
import { api } from '../services/api'

// Guarda cuantas unidades hay en el carrito, para que la barra de navegacion
// lo pueda mostrar. Navigation y las pantallas que tocan el carrito son
// componentes hermanos: no pueden pasarse el dato por props, tiene que vivir
// mas arriba que los dos
const CartContext = createContext()

export function CartProvider({ children }) {

    const [cantidad, setCantidad] = useState(0)

    // Vuelve a pedir el carrito y recalcula el total de unidades.
    // La llaman las pantallas cada vez que cambian algo
    function refrescarCarrito() {
        // Sin sesion no hay carrito que pedir, y /cart responderia 403
        if (localStorage.getItem('token') === null) {
            setCantidad(0)
            return
        }

        api('/cart')
            // reduce recorre las lineas sumando sus cantidades: dos botellas de
            // una y tres de otra son cinco unidades, no dos lineas
            .then(data => setCantidad(data.items.reduce((suma, item) => suma + item.quantity, 0)))
            // Si falla, es preferible mostrar cero antes que un numero viejo
            .catch(() => setCantidad(0))
    }

    return (
        <CartContext.Provider value={{ cantidad, refrescarCarrito }}>
            {children}
        </CartContext.Provider>
    )
}

// Atajo para leer el carrito con una sola linea, igual que useAuth
export function useCart() {
    return useContext(CartContext)
}
