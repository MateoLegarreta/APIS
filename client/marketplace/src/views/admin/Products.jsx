import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, saveProduct, changeProductStatus } from '../../redux/productSlice'
import { fetchCategories } from '../../redux/categorySlice'
import MenuAdmin from '../../components/MenuAdmin'
// Se importa con otro nombre porque "precio" ya es el estado del campo del formulario
import { precio as formatoPrecio } from '../../utils/precio'

// ABM de productos del panel de admin: alta, modificacion y baja logica,
// con subida de foto. El mismo formulario sirve para crear y para editar
function Products() {
    const dispatch = useDispatch()
    const { adminItems: productos, adminLoading: cargando, adminError } = useSelector((state) => state.products)
    const { items: categorias, cargado: categoriasCargadas } = useSelector((state) => state.categories)
    // Error de una accion (baja, reactivar). El de la lista viene del slice
    const [errorAccion, setErrorAccion] = useState('')
    const error = errorAccion || adminError
    const [mensajeOk, setMensajeOk] = useState('')

    const [mostrarForm, setMostrarForm] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [errorForm, setErrorForm] = useState('')

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState('')
    const [stock, setStock] = useState('')
    const [categoriaId, setCategoriaId] = useState('')

    // La foto que el admin eligio en el formulario, todavia sin subir
    const [archivo, setArchivo] = useState(null)

    // null = estoy creando un producto nuevo; con id = estoy editando ese producto
    const [editandoId, setEditandoId] = useState(null)

    // La foto que el producto ya tenia, para no perderla si se edita sin cambiarla
    const [imagenActual, setImagenActual] = useState(null)

    // false = lista de productos activos, true = lista de dados de baja (para reactivarlos)
    const [verInactivos, setVerInactivos] = useState(false)

    // La lista que se administra. Se vuelve a pedir cada vez que se cambia entre
    // activos y dados de baja
    useEffect(() => {
        setErrorAccion('')
        dispatch(fetchAdminProducts(verInactivos))
    }, [verInactivos, dispatch])

    // Las categorias, para llenar el desplegable del formulario. Son las mismas
    // del catalogo: si ya se pidieron alla, no se vuelven a pedir
    useEffect(() => {
        if (!categoriasCargadas) {
            dispatch(fetchCategories())
        }
    }, [dispatch])

    // Deja el formulario en blanco y vuelve al modo "crear"
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

    // Abre el formulario con los datos del producto ya cargados
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

    // Guarda el producto. El slice sube la foto (si se eligio una) y despues
    // manda el producto: POST si es nuevo, PUT si se esta editando.
    // Tambien actualiza la lista en pantalla con lo que devuelve el back
    function handleGuardar() {
        setMensajeOk('')
        if (!nombre.trim() || !descripcion.trim() || !precio || !stock || !categoriaId) {
            setErrorForm('Completa todos los campos')
            return
        }
        setErrorForm('')
        setGuardando(true)

        dispatch(saveProduct({
            id: editandoId,
            archivo,
            datos: {
                name: nombre.trim(),
                description: descripcion.trim(),
                price: Number(precio),
                stock: Number(stock),
                categoryId: Number(categoriaId),
                // Si no se sube una foto nueva, se conserva la que ya tenia
                imageId: imagenActual
            }
        }))
            .unwrap()
            .then(() => {
                setMensajeOk(editandoId ? 'Producto actualizado con éxito' : 'Producto agregado con éxito')
                setMostrarForm(false)
                limpiarFormulario()
            })
            .catch(error => setErrorForm(error.message))
            .finally(() => setGuardando(false))
    }

    // Alterna entre la lista de activos y la de dados de baja
    function cambiarVista() {
        setVerInactivos(!verInactivos)
        setMostrarForm(false)
        limpiarFormulario()
        setErrorForm('')
        setMensajeOk('')
    }

    // Baja y reactivacion son el mismo PUT cambiando "active".
    // No hay DELETE: los pedidos ya hechos apuntan al producto y borrarlo
    // romperia el historial de compras. El slice saca el producto de la lista
    function cambiarEstado(producto, active, mensaje) {
        setMensajeOk('')
        setErrorAccion('')

        dispatch(changeProductStatus({ producto, active }))
            .unwrap()
            .then(() => setMensajeOk(mensaje))
            .catch(error => setErrorAccion(error.message))
    }

    function handleReactivar(producto) {
        cambiarEstado(producto, true, 'Producto reactivado')
    }

    function handleBaja(producto) {
        if (!window.confirm('Seguro queres dar de baja "' + producto.name + '"?')) return
        cambiarEstado(producto, false, 'Producto dado de baja')
    }


return (
    <>
        <MenuAdmin/>
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
                        <td className="numero">{formatoPrecio(producto.price)}</td>
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
