import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function Products() {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [mensajeOk, setMensajeOk] = useState('')

    const [mostrarForm, setMostrarForm] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [errorForm, setErrorForm] = useState('')

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState('')
    const [stock, setStock] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [categorias, setCategorias] = useState([])

    const [archivo, setArchivo] = useState(null)
    const [editandoId, setEditandoId] = useState(null)

    const [imagenActual, setImagenActual] = useState(null)

    // false = lista de productos activos, true = lista de dados de baja (para reactivarlos)
    const [verInactivos, setVerInactivos] = useState(false)

    // La lista que se administra. Se vuelve a pedir cada vez que se cambia entre
    // activos y dados de baja
    useEffect(() => {
        setCargando(true)
        setError('')
        api(verInactivos ? '/products/inactive?size=100' : '/products?size=100')
            .then(data => setProductos(data.content))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false))
    }, [verInactivos])

    // Las categorias, para llenar el desplegable del formulario
    useEffect(() => {
        api('/categories?size=100')
            .then(data => setCategorias(data.content))
            .catch(error => console.error(error))
    }, [])

    function subirImagen() {
        if (!archivo) return Promise.resolve(null)
        const formData = new FormData()
        formData.append('file', archivo)
        return api('/images', { method: 'POST', body: formData })
            .then(data => data.id)
    }

    function limpiarFormulario() {
        setEditandoId(null)
        setNombre('')
        setDescripcion('')
        setPrecio('')
        setStock('')
        setCategoriaId('')
        setArchivo(null)
        setImagenActual(null)
    }

    function empezarEdicion(producto) {
        setEditandoId(producto.id)
        setNombre(producto.name)
        setDescripcion(producto.description)
        setPrecio(producto.price)
        setStock(producto.stock)
        setCategoriaId(producto.category.id)
        setArchivo(null)
        setErrorForm('')
        setMensajeOk('')
        setMostrarForm(true)
        setImagenActual(producto.imageId)
    }

    function handleGuardar() {
        setMensajeOk('')
        if (!nombre.trim() || !descripcion.trim() || !precio || !stock || !categoriaId) {
            setErrorForm('Completa todos los campos')
            return
        }
        setErrorForm('')
        setGuardando(true)

        subirImagen()
            .then(imagenId => {
                const imagenFinal = imagenId !== null ? imagenId : imagenActual
                return api(editandoId ? '/products/' + editandoId : '/products', {
                    method: editandoId ? 'PUT' : 'POST',
                    body: JSON.stringify({
                        name: nombre.trim(),
                        description: descripcion.trim(),
                        price: Number(precio),
                        stock: Number(stock),
                        categoryId: Number(categoriaId),
                        imageId: imagenFinal
                    })
                })
            })
            .then(guardado => {
                if (editandoId) {
                    setProductos(productos.map(p => p.id === editandoId ? guardado : p))
                    setMensajeOk('Producto actualizado con éxito')
                } else {
                    setProductos([...productos, guardado])
                    setMensajeOk('Producto agregado con éxito')
                }
                setMostrarForm(false)
                limpiarFormulario()

            })
            .catch(error => setErrorForm(error.message))
            .finally(() => setGuardando(false))
    }

    function cambiarVista() {
        setVerInactivos(!verInactivos)
        setMostrarForm(false)
        limpiarFormulario()
        setErrorForm('')
        setMensajeOk('')
    }

    // La unica falla esperable al reactivar: la categoria del producto esta dada de baja
    // (el back responde 404 porque no deja cargar productos en una categoria retirada)
    function traducirErrorReactivar(mensaje) {
        if (mensaje === 'Error 404') return 'No se pudo reactivar: la categoria del producto esta dada de baja. Reactivala primero en Admin categorias'
        return mensaje
    }

    // Vuelve a dar de alta un producto: es el mismo PUT que la baja, pero con active: true
    function handleReactivar(producto) {
        setMensajeOk('')
        setError('')

        api('/products/' + producto.id, {
            method: 'PUT',
            body: JSON.stringify({
                name: producto.name,
                description: producto.description,
                price: producto.price,
                stock: producto.stock,
                categoryId: producto.category.id,
                imageId: producto.imageId,
                active: true
            })
        })
            .then(() => {
                setProductos(productos.filter(p => p.id !== producto.id))
                setMensajeOk('Producto reactivado')
            })
            .catch(error => setError(traducirErrorReactivar(error.message)))
    }

    function handleBaja(producto) {
        if (!window.confirm('Seguro queres dar de baja "' + producto.name + '"?')) return
        setMensajeOk('')
        setError('')

        api('/products/' + producto.id, {
            method: 'PUT',
            body: JSON.stringify({
                name: producto.name,
                description: producto.description,
                price: producto.price,
                stock: producto.stock,
                categoryId: producto.category.id,
                imageId: producto.imageId,
                active: false
            })
        })
            .then(() => {
                setProductos(productos.filter(p => p.id !== producto.id))
                setMensajeOk('Producto dado de baja')
            })
            .catch(error => setError(error.message))
    }


return (
    <>
        <div className="admin-encabezado">
            <h1>{verInactivos ? 'Productos dados de baja' : 'Productos'}</h1>
            <div className="acciones">
                <button className="boton boton-secundario" onClick={cambiarVista}>
                    {verInactivos ? 'Ver activos' : 'Ver dados de baja'}
                </button>
                {!verInactivos && (
                    <button className="boton" onClick={() => setMostrarForm(!mostrarForm)}>
                        {mostrarForm ? 'Cancelar' : 'Nuevo producto'}
                    </button>
                )}
            </div>
        </div>
        {mensajeOk && <p className="mensaje-ok">{mensajeOk}</p>}
        {error && <p className="mensaje-error">{error}</p>}
        {mostrarForm && (
            <form className="form-caja" onSubmit={(e) => e.preventDefault()}>
                {errorForm && <p className="mensaje-error">{errorForm}</p>}
                <input value={nombre} placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
                <textarea value={descripcion} placeholder="Descripción" rows={3} onChange={e => setDescripcion(e.target.value)} />
                <input value={precio} placeholder="Precio" type="number" onChange={e => setPrecio(e.target.value)} />
                <input value={stock} placeholder="Stock" type="number" onChange={e => setStock(e.target.value)} />
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>{categoria.description}</option>
                    ))}
                </select>
                <input type="file" accept="image/*" onChange={e => setArchivo(e.target.files[0])} />
                <button className="boton" onClick={handleGuardar} disabled={guardando}>
                    {guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Crear productos')}
                </button>
            </form>
        )}

        {cargando && <p>Cargando productos...</p>}
        {!cargando && productos.length === 0 && (
            <p className="mensaje-vacio">
                {verInactivos ? 'No hay productos dados de baja' : 'No hay productos'}
            </p>
        )}
        {!cargando && productos.length > 0 && (
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
                        <td className="numero">${producto.price}</td>
                        <td className="numero">{producto.stock}</td>
                        <td>
                            <div className="acciones">
                                {verInactivos ? (
                                    <button className="boton boton-secundario" onClick={() => handleReactivar(producto)}>
                                        Reactivar
                                    </button>
                                ) : (
                                    <>
                                        <button className="boton boton-secundario" onClick={() => empezarEdicion(producto)}>
                                            Editar
                                        </button>
                                        <button className="boton boton-secundario" onClick={() => handleBaja(producto)} >
                                            Dar de baja
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
    </>
)
}

export default Products
