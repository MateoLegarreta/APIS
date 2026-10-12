import { useState, useEffect } from 'react'


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
            <h1>Catálogo de Produtos</h1>
            <p>Explora la variedad de nuestros productos disponibles para compra.</p>
            {productos.map(producto => (
                <div key={producto.id}>
                    <h2>{producto.name}</h2>
                    <p>Precio: ${producto.finalPrice}</p>
                </div>
            ))}
        </div>
    );
    
}
export default Catalogo;