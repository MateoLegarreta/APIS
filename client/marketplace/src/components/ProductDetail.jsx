import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// Muestra todos los datos de un producto, que lo pide al backend por su id
function ProductDetail() {
    const { id } = useParams()
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        setError('')
        setProducto(null)

        fetch('/products/' + id)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    if (response.status === 404) {
                        throw new Error('El producto no existe')
                    }
                    throw new Error('Error al cargar el producto')
                }
            })
            .then(data => setProducto(data))
            .catch(error => {
                setError(error.message)
                console.error(error)
            })
    }, [id])

    if (error) {
        return (
            <>
                <p>{error}</p>
                <Link to="/">Volver al catálogo</Link>
            </>
        )
    }

    if (!producto) {
        return <p>Cargando...</p>
    }

    const tieneDescuento = producto.discountPercentage > 0

    return (
        <div>
            <h1>{producto.name}</h1>
            <p>{producto.description}</p>
            <p>Categoría: {producto.category?.description}</p>

            {tieneDescuento && (
                <p>
                    <s>Precio: ${producto.price}</s> ({producto.discountPercentage}% de descuento)
                </p>
            )}
            <p>Precio: ${producto.finalPrice}</p>

            <p>
                {producto.stock > 0
                    ? 'Stock disponible: ' + producto.stock
                    : 'Sin stock'}
            </p>

            <Link to="/">Volver al catálogo</Link>
        </div>
    )
}

export default ProductDetail
