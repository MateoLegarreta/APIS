import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function Products() {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api('/products?size=100')
        .then(data => setProductos(data.content))
        .catch(error => setError(error.message))
        .finally(() => setCargando(false))
    }, [])

    if (cargando) return <p>Cargando productos...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (productos.length === 0) return <p className="mensaje-vacio">No hay productos</p>


return (
          <>
              <h1 className="carrito-titulo">Productos</h1>

              <table className="tabla">
                  <thead>
                      <tr>
                          <th>Nombre</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      {productos.map(producto => (
                          <tr key={producto.id}>
                              <td>{producto.name}</td>
                              <td>{producto.category?.description}</td>
                              <td>${producto.price}</td>
                              <td>{producto.stock}</td>
                              <td></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </>
      )
    }

export default Products