import { useState, useEffect } from 'react'
import CardProduct from './CardProduct'

function Catalogo() {
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])

    const [busqueda, setBusqueda] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [precioMin, setPrecioMin] = useState('')
    const [precioMax, setPrecioMax] = useState('')

    // Hace el pedido a la direccion que le pasen
    function pedirProductos(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => setProductos(data.content))
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Arma la direccion con los filtros que esten completos y pide.
    // Los que quedaron vacios no se mandan, y el backend los ignora
    function buscarProductos() {
        const params = new URLSearchParams()

        if (busqueda !== '')    params.append('name', busqueda)
        if (categoriaId !== '') params.append('categoryId', categoriaId)
        if (precioMin !== '')   params.append('priceMin', precioMin)
        if (precioMax !== '')   params.append('priceMax', precioMax)

        const consulta = params.toString()
        pedirProductos(consulta === '' ? '/products' : '/products?' + consulta)
    }

    // Vacia los campos y pide todo de nuevo. No llama a buscarProductos
    // porque los setXxx de arriba todavia no se aplicaron en esta vuelta
    function limpiarFiltros() {
        setBusqueda('')
        setCategoriaId('')
        setPrecioMin('')
        setPrecioMax('')
        pedirProductos('/products')
    }

    // Al abrir la pantalla se piden todos los productos, sin filtrar
    useEffect(() => {
        pedirProductos('/products')
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
        </div>
    );
}

export default Catalogo;