import { useState, useEffect } from 'react'
import CardProduct from './CardProduct'

function Catalogo() {
    const [productos, setProductos] = useState([])

    useEffect(() => {
        fetch('/products')
            .then(response => response.json())
            .then(data => setProductos(data.content))
            .catch(error => console.error('Error al cargar los productos:', error));
    }, [])

    return (
        <div className="catalogo">
            <h1>Catálogo de Productos</h1>
            <p>Explora la variedad de nuestros productos disponibles para compra.</p>
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