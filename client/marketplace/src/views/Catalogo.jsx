import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CardProduct from '../components/CardProduct'
import { fetchProducts } from '../redux/productSlice'
import { fetchCategories } from '../redux/categorySlice'

// Catalogo completo con filtros. Los filtros viven en la URL
// (/catalogo?categoria=2&buscar=malbec): asi el buscador de la barra y los
// "Ver todos" del inicio pueden mandar a un catalogo ya filtrado, y si se
// comparte o refresca la pagina se ve lo mismo
function Catalogo() {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()

    // Todo lo del catalogo vive en el store: si ya se pidio, al volver a esta
    // pantalla se muestra directo sin hacer otro pedido al backend
    const { items: productos, loading, error, cargado, pagina, totalPaginas, filtros } =
        useSelector((state) => state.products)
    const { items: categorias, cargado: categoriasCargadas } = useSelector((state) => state.categories)

    const buscar = searchParams.get('buscar') ?? ''
    const categoria = searchParams.get('categoria') ?? ''
    const desde = searchParams.get('desde') ?? ''
    const hasta = searchParams.get('hasta') ?? ''

    // Los campos de precio se aplican al apretar el boton, no con cada tecla
    const [precioMin, setPrecioMin] = useState(desde)
    const [precioMax, setPrecioMax] = useState(hasta)

    // Traduce la URL a los nombres que espera el back. Los vacios no se mandan.
    // JSON.stringify lo convierte en texto para poder compararlo facil
    const filtrosUrl = {}
    if (buscar)    filtrosUrl.name = buscar
    if (categoria) filtrosUrl.categoryId = categoria
    if (desde)     filtrosUrl.priceMin = desde
    if (hasta)     filtrosUrl.priceMax = hasta
    const clave = JSON.stringify(filtrosUrl)

    // Se pide solo si nunca se pidio o si los filtros de la URL cambiaron.
    // Si se vuelve al catalogo con los mismos filtros, se muestra lo guardado
    // (incluida la pagina en la que estaba)
    useEffect(() => {
        if (!cargado || JSON.stringify(filtros) !== clave) {
            dispatch(fetchProducts({ filtros: JSON.parse(clave), pagina: 0 }))
        }
    }, [clave, dispatch])

    // Las categorias casi no cambian: se piden una sola vez
    useEffect(() => {
        if (!categoriasCargadas) {
            dispatch(fetchCategories())
        }
    }, [categoriasCargadas, dispatch])

    // Si la URL cambia (por ejemplo, desde la barra) los campos de precio la siguen
    useEffect(() => {
        setPrecioMin(desde)
        setPrecioMax(hasta)
    }, [desde, hasta])

    // Cambia un dato de la URL y deja los demas como estaban
    function cambiarFiltro(nombre, valor) {
        const nuevos = new URLSearchParams(searchParams)
        if (valor) nuevos.set(nombre, valor)
        else nuevos.delete(nombre)
        setSearchParams(nuevos)
    }

    function aplicarPrecio(e) {
        e.preventDefault()
        const nuevos = new URLSearchParams(searchParams)
        if (precioMin) nuevos.set('desde', precioMin)
        else nuevos.delete('desde')
        if (precioMax) nuevos.set('hasta', precioMax)
        else nuevos.delete('hasta')
        setSearchParams(nuevos)
    }

    // Cambia de pagina con los filtros de la ultima busqueda
    function irAPagina(nroPagina) {
        dispatch(fetchProducts({ filtros, pagina: nroPagina }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const nombreCategoria = categorias.find((c) => String(c.id) === categoria)?.description
    const hayFiltros = buscar || categoria || desde || hasta

    let titulo = 'Todo el catálogo'
    if (nombreCategoria) titulo = nombreCategoria
    if (buscar) titulo = 'Resultados para “' + buscar + '”'

    // Tres situaciones distintas y una sola pantalla: conviene resolverlas
    // con returns tempranos en vez de ternarios anidados
    function mostrarProductos() {
        if (loading || !cargado) {
            return <p className="mensaje-vacio">Cargando productos...</p>
        }

        // Va antes del vacio: si fallo el pedido no sabemos si hay productos
        // o no, y decir que no hay seria mentir
        if (error) {
            return <p className="mensaje-error">{error}</p>
        }

        if (productos.length === 0) {
            return (
                <div className="mensaje-vacio">
                    <p>No hay productos que coincidan con lo que elegiste.</p>
                    <Link to="/catalogo" className="boton boton-secundario">Ver todo el catálogo</Link>
                </div>
            )
        }

        return (
            <div className="grilla">
                {productos.map(producto => (
                    <CardProduct key={producto.id} producto={producto} />
                ))}
            </div>
        )
    }

    return (
        <div className="catalogo">
            <aside className="filtros" aria-label="Filtros">
                <h2>Categorías</h2>
                <ul className="filtros-categorias">
                    <li>
                        <button type="button" className={categoria === '' ? 'active' : ''}
                                onClick={() => cambiarFiltro('categoria', '')}>
                            Todas
                        </button>
                    </li>
                    {categorias.map(c => (
                        <li key={c.id}>
                            <button type="button" className={categoria === String(c.id) ? 'active' : ''}
                                    onClick={() => cambiarFiltro('categoria', String(c.id))}>
                                {c.description}
                            </button>
                        </li>
                    ))}
                </ul>

                <h2>Precio</h2>
                <form className="filtros-precio" onSubmit={aplicarPrecio}>
                    <input type="number" min="0" placeholder="Desde" aria-label="Precio desde"
                           value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} />
                    <input type="number" min="0" placeholder="Hasta" aria-label="Precio hasta"
                           value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} />
                    <button type="submit" className="boton boton-secundario">Aplicar</button>
                </form>

                {hayFiltros && <Link to="/catalogo" className="filtros-limpiar">Quitar filtros</Link>}
            </aside>

            <section className="catalogo-resultados">
                <h1 className="catalogo-titulo">{titulo}</h1>

                {mostrarProductos()}

                {/* Si el pedido fallo, totalPaginas quedo con el valor viejo:
                    mostrarlo seria ofrecer paginas que no sabemos si existen */}
                {!error && cargado && totalPaginas > 1 && (
                    <div className="paginado">
                        <button
                            type="button"
                            className="boton boton-secundario"
                            onClick={() => irAPagina(pagina - 1)}
                            disabled={pagina === 0}>
                            Anterior
                        </button>

                        <span>Página {pagina + 1} de {totalPaginas}</span>

                        <button
                            type="button"
                            className="boton boton-secundario"
                            onClick={() => irAPagina(pagina + 1)}
                            disabled={pagina >= totalPaginas - 1}>
                            Siguiente
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Catalogo;
