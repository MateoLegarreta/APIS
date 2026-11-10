import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminCategories, saveCategory, changeCategoryStatus } from '../../redux/categorySlice'
import MenuAdmin from '../../components/MenuAdmin'

// ABM de categorias. Es el mismo patron que Products.jsx pero con un solo campo (description)
function Categories() {
    const dispatch = useDispatch()
    const { adminItems: categorias, adminLoading: cargando, adminError } = useSelector((state) => state.categories)
    // Error de una accion (baja, reactivar). El de la lista viene del slice
    const [errorAccion, setErrorAccion] = useState('')
    const error = errorAccion || adminError
    const [mensajeOk, setMensajeOk] = useState('')

    const [mostrarForm, setMostrarForm] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [errorForm, setErrorForm] = useState('')

    const [descripcion, setDescripcion] = useState('')
    const [editandoId, setEditandoId] = useState(null)

    // false = categorias activas, true = dadas de baja (para reactivarlas)
    const [verInactivas, setVerInactivas] = useState(false)

    // La lista que se administra. Se vuelve a pedir cada vez que se cambia entre
    // activas y dadas de baja
    useEffect(() => {
        setErrorAccion('')
        dispatch(fetchAdminCategories(verInactivas))
    }, [verInactivas, dispatch])

    function limpiarFormulario() {
        setEditandoId(null)
        setDescripcion('')
    }

    function empezarEdicion(categoria) {
        setEditandoId(categoria.id)
        setDescripcion(categoria.description)
        setErrorForm('')
        setMensajeOk('')
        setMostrarForm(true)
    }

    // Alta y edicion comparten el formulario; si hay editandoId es una edicion (PUT).
    // Los mensajes de error (400 = descripcion repetida, etc.) vienen del slice
    function handleGuardar() {
        setMensajeOk('')
        if (!descripcion.trim()) {
            setErrorForm('Completa la descripcion')
            return
        }
        setErrorForm('')
        setGuardando(true)

        dispatch(saveCategory({ id: editandoId, description: descripcion.trim() }))
            .unwrap()
            .then(() => {
                setMensajeOk(editandoId ? 'Categoria actualizada con exito' : 'Categoria agregada con exito')
                setMostrarForm(false)
                limpiarFormulario()
            })
            .catch(error => setErrorForm(error.message))
            .finally(() => setGuardando(false))
    }

    function cambiarVista() {
        setVerInactivas(!verInactivas)
        setMostrarForm(false)
        limpiarFormulario()
        setErrorForm('')
        setMensajeOk('')
    }

    // Baja y reactivacion: el mismo PUT de la edicion cambiando "active".
    // El slice saca la categoria de la lista y trae el mensaje de error que
    // corresponda (409 al dar de baja = todavia tiene productos activos)
    function cambiarEstado(categoria, active, mensaje) {
        setMensajeOk('')
        setErrorAccion('')

        dispatch(changeCategoryStatus({ categoria, active }))
            .unwrap()
            .then(() => setMensajeOk(mensaje))
            .catch(error => setErrorAccion(error.message))
    }

    function handleReactivar(categoria) {
        cambiarEstado(categoria, true, 'Categoria reactivada')
    }

    function handleBaja(categoria) {
        if (!window.confirm('Seguro queres dar de baja "' + categoria.description + '"?')) return
        cambiarEstado(categoria, false, 'Categoria dada de baja')
    }

    return (
        <>
            <MenuAdmin/>
            <div className="admin-encabezado">
                <h1>{verInactivas ? 'Categorias dadas de baja' : 'Categorias'}</h1>
                <div className="acciones">
                    <button className="boton boton-secundario" onClick={cambiarVista}>
                        {verInactivas ? 'Ver activas' : 'Ver dadas de baja'}
                    </button>
                    {!verInactivas && (
                        <button
                            className="boton"
                            onClick={() => {
                                // Al cancelar o abrir "Nueva", se descarta cualquier edicion a medias
                                limpiarFormulario()
                                setErrorForm('')
                                setMostrarForm(!mostrarForm)
                            }}>
                            {mostrarForm ? 'Cancelar' : 'Nueva categoria'}
                        </button>
                    )}
                </div>
            </div>
            {mensajeOk && <p className="mensaje-ok">{mensajeOk}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            {mostrarForm && (
                <form className="form-caja" onSubmit={(e) => e.preventDefault()}>
                    {errorForm && <p className="mensaje-error">{errorForm}</p>}
                    <input value={descripcion} placeholder="Descripcion" onChange={e => setDescripcion(e.target.value)} />
                    <button className="boton" onClick={handleGuardar} disabled={guardando}>
                        {guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Crear categoria')}
                    </button>
                </form>
            )}

            {cargando && <p>Cargando categorias...</p>}
            {!cargando && categorias.length === 0 && (
                <p className="mensaje-vacio">
                    {verInactivas ? 'No hay categorias dadas de baja' : 'No hay categorias'}
                </p>
            )}
            {!cargando && categorias.length > 0 && (
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Descripcion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(categoria => (
                            <tr key={categoria.id}>
                                <td>{categoria.description}</td>
                                <td>
                                    <div className="acciones">
                                        {verInactivas ? (
                                            <button className="boton boton-secundario" onClick={() => handleReactivar(categoria)}>
                                                Reactivar
                                            </button>
                                        ) : (
                                            <>
                                                <button className="boton boton-secundario" onClick={() => empezarEdicion(categoria)}>
                                                    Editar
                                                </button>
                                                <button className="boton boton-secundario" onClick={() => handleBaja(categoria)}>
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

export default Categories
