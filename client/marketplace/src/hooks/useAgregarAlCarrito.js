import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { addToCart } from '../redux/cartSlice'

// Agregar al carrito se usa en dos lugares (la tarjeta del catalogo y el
// detalle), y en los dos hay que hacer lo mismo: si no hay sesion, mandar al
// login con un aviso, y si la hay, despachar addToCart.
// Un hook propio (una funcion que empieza con "use" y usa otros hooks) deja
// escribir eso una sola vez
export function useAgregarAlCarrito() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const logueado = useSelector((state) => state.user.token !== null)

    // Devuelve una promesa: la pantalla decide que mostrar si sale bien o mal.
    // Si no hay sesion devuelve false y no hace el pedido
    return function agregar(productId, quantity = 1) {
        if (!logueado) {
            // volverA: al iniciar sesion, el login devuelve al usuario aca
            navigate('/login', {
                state: {
                    aviso: 'Iniciá sesión para agregar productos al carrito.',
                    volverA: location.pathname + location.search,
                },
            })
            return Promise.resolve(false)
        }
        return dispatch(addToCart({ productId, quantity })).unwrap().then(() => true)
    }
}
