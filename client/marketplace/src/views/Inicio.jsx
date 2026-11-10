import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../redux/productSlice'
import { fetchCategories } from '../redux/categorySlice'
import CardProduct from '../components/CardProduct'
import Foto from '../components/Foto'
import Aparecer from '../components/Aparecer'
import { IconoFlecha, IconoLocal, IconoReloj, IconoTarjeta } from '../components/Iconos'
import { precio } from '../utils/precio'

// Una fila de productos de una categoria, que se desliza de costado.
// Las flechas mueven la fila el ancho de lo que se ve en pantalla
function FilaCategoria({ categoria, productos }) {
    const filaRef = useRef(null)

    function mover(direccion) {
        const fila = filaRef.current
        fila.scrollBy({ left: direccion * fila.clientWidth * 0.9, behavior: 'smooth' })
    }

    return (
        <section className="fila">
            <div className="fila-encabezado">
                <h2>{categoria.description}</h2>
                <Link to={'/catalogo?categoria=' + categoria.id} className="fila-ver-todos">
                    Ver {productos.length === 1 ? 'el producto' : 'los ' + productos.length}
                </Link>
                <div className="fila-flechas">
                    <button type="button" onClick={() => mover(-1)} aria-label="Anteriores">
                        <IconoFlecha direccion="izquierda" tamanio={18} />
                    </button>
                    <button type="button" onClick={() => mover(1)} aria-label="Siguientes">
                        <IconoFlecha tamanio={18} />
                    </button>
                </div>
            </div>

            <div className="fila-productos" ref={filaRef}>
                {productos.map((producto) => (
                    <CardProduct key={producto.id} producto={producto} />
                ))}
            </div>
        </section>
    )
}

// Pagina de inicio: portada, lo que ofrece el local y una fila por categoria
function Inicio() {
    const dispatch = useDispatch()
    const location = useLocation()
    const sesionIniciada = location.state?.sesionIniciada === true

    const { todos, todosCargado, todosLoading } = useSelector((state) => state.products)
    const { items: categorias, cargado: categoriasCargadas } = useSelector((state) => state.categories)

    // Un solo pedido con todos los productos. Se agrupan aca, en el front,
    // en vez de pedir cada categoria por separado
    useEffect(() => {
        if (!todosCargado && !todosLoading) {
            dispatch(fetchAllProducts())
        }
    }, [dispatch])

    useEffect(() => {
        if (!categoriasCargadas) {
            dispatch(fetchCategories())
        }
    }, [dispatch])

    // Para la portada: el primer producto con descuento y foto; si no hay, el primero con foto
    const destacado = todos.find((p) => p.discountPercentage > 0 && p.imageId)
        ?? todos.find((p) => p.imageId)

    // Cada categoria con sus productos. Las que no tienen ninguno no se muestran
    const filas = categorias
        .map((categoria) => ({
            categoria,
            productos: todos.filter((p) => p.category?.id === categoria.id),
        }))
        .filter((fila) => fila.productos.length > 0)

    return (
        <div className="inicio">
            {sesionIniciada && <p className="mensaje-ok aviso">Sesión iniciada. ¡Bienvenido!</p>}

            <section className="portada">
                <div className="portada-texto">
                    <h1>Vinos, cervezas y destilados, elegidos uno por uno.</h1>
                    <p>Más de veinte etiquetas para la mesa de todos los días y para las ocasiones que lo merecen.</p>
                    <Link to="/catalogo" className="boton boton-claro">Ver el catálogo</Link>
                </div>

                {destacado && (
                    <Link to={'/producto/' + destacado.id} className="portada-destacado">
                        <div className="portada-arco">
                            <Foto imageId={destacado.imageId} alt={destacado.name} tamanio={320} />
                        </div>
                        <p className="portada-destacado-nombre">{destacado.name}</p>
                        <p className="portada-destacado-precio">
                            {precio(destacado.finalPrice)}
                            {destacado.discountPercentage > 0 && <span> con {destacado.discountPercentage}% off</span>}
                        </p>
                    </Link>
                )}
            </section>

            <ul className="beneficios">
                <li>
                    <IconoTarjeta />
                    <div>
                        <strong>Pagá con tarjeta</strong>
                        <p>Crédito o débito, al confirmar la compra.</p>
                    </div>
                </li>
                <li>
                    <IconoReloj />
                    <div>
                        <strong>Abierto de lunes a sábado</strong>
                        <p>De lunes a viernes de 10 a 21 y los sábados de 10 a 15.</p>
                    </div>
                </li>
                <li>
                    <IconoLocal />
                    <div>
                        <strong>Lima 717, CABA</strong>
                        <p>El local, con las mismas etiquetas que ves acá.</p>
                    </div>
                </li>
            </ul>

            {!todosCargado && <p className="mensaje-vacio">Cargando productos...</p>}

            {filas.map((fila) => (
                <Aparecer key={fila.categoria.id}>
                    <FilaCategoria categoria={fila.categoria} productos={fila.productos} />
                </Aparecer>
            ))}
        </div>
    )
}

export default Inicio
