import { useState, useEffect } from 'react'
import CardProduct from './CardProduct'

// Cuantos productos se muestran por pagina
const TAMANIO = 6

function Catalogo() {
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])

    const [busqueda, setBusqueda] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [precioMin, setPrecioMin] = useState('')
    const [precioMax, setPrecioMax] = useState('')

    const [pagina, setPagina] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)

    // Junta los filtros que esten completos. Los vacios no se mandan
    // y el backend los ignora
    function armarFiltros() {
        const params = new URLSearchParams()

        if (busqueda !== '')    params.append('name', busqueda)
        if (categoriaId !== '') params.append('categoryId', categoriaId)
        if (precioMin !== '')   params.append('priceMin', precioMin)
        if (precioMax !== '')   params.append('priceMax', precioMax)

        return params
    }

    // Hace el pedido y guarda los productos, cuantas paginas hay en total
    // y en cual quedo parado el usuario
    function pedirProductos(params, nroPagina) {
        params.append('page', nroPagina)
        params.append('size', TAMANIO)

        fetch('/products?' + params.toString())
            .then(response => response.json())
            .then(data => {
                setProductos(data.content)
                setTotalPaginas(data.totalPages)
                setPagina(nroPagina)
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Una busqueda nueva siempre arranca en la primera pagina
    function buscarProductos() {
        pedirProductos(armarFiltros(), 0)
    }

    // Cambia de pagina manteniendo los filtros que esten puestos
    function irAPagina(nroPagina) {
        pedirProductos(armarFiltros(), nroPagina)
    }

    // Vacia los campos y pide todo de nuevo. No usa armarFiltros porque
    // los setXxx de arriba todavia no se aplicaron en esta vuelta
    function limpiarFiltros() {
        setBusqueda('')
        setCategoriaId('')
        setPrecioMin('')
        setPrecioMax('')
        pedirProductos(new URLSearchParams(), 0)
    }

    // Al abrir la pantalla se pide la primera pagina, sin filtrar
    useEffect(() => {
        pedirProductos(new URLSearchParams(), 0)
    }, [])

    // Y tambien las categorias, para llenar el desplegable
    useEffect(() => {
        fetch('/categories')
            .then(response => response.json())
            .then(data => setCategorias(data.content))
            .catch(error => console.error('Error al cargar las categorias:', error));
    }, [])

    return (
        <div className="catalogo">
            <h1>Catálogo de Productos</h1>
            <p>Explora la variedad de nuestros productos disponibles para compra.</p>

            <form onSubmit={(e) => { e.preventDefault(); buscarProductos(); }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.description}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Precio desde"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Precio hasta"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                />

                <button type="submit">Buscar</button>
                <button type="button" onClick={limpiarFiltros}>Limpiar</button>
            </form>

            {productos.map(producto => (
                <CardProduct
                    key={producto.id}
                    nombre={producto.name}
                    precio={producto.finalPrice}
                />
            ))}

            {totalPaginas > 1 && (
                <div className="paginado">
                    <button
                        type="button"
                        onClick={() => irAPagina(pagina - 1)}
                        disabled={pagina === 0}>
                        Anterior
                    </button>

                    <span>Página {pagina + 1} de {totalPaginas}</span>

                    <button
                        type="button"
                        onClick={() => irAPagina(pagina + 1)}
                        disabled={pagina >= totalPaginas - 1}>
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default Catalogo;