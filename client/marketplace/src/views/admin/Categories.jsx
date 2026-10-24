import { useState, useEffect } from 'react'
import { api } from '../../services/api'

// ABM de categorias. Es el mismo patron que Products.jsx pero con un solo campo (description)
function Categories() {
    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
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
        setCargando(true)
        setError('')
        api(verInactivas ? '/categories/inactive?size=100' : '/categories?size=100')
            .then(data => setCategorias(data.content))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false))
    }, [verInactivas])

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

    // Alta y edicion comparten el formulario; si hay editandoId es una edicion (PUT)
    function traducirErrorForm(mensaje) {
        if (mensaje === 'Error 400') return 'Ya existe una categoria con esa descripcion'
        if (mensaje === 'Error 404') return 'Esa categoria ya no existe'
        return mensaje
    }

    function handleGuardar() {
        setMensajeOk('')
        if (!descripcion.trim()) {
            setErrorForm('Completa la descripcion')
            return
        }
        setErrorForm('')
        setGuardando(true)

        api(editandoId ? '/categories/' + editandoId : '/categories', {
            method: editandoId ? 'PUT' : 'POST',
            body: JSON.stringify({ description: descripcion.trim() })
        })
            .then(guardada => {
                if (editandoId) {
                    setCategorias(categorias.map(c => c.id === editandoId ? guardada : c))
                    setMensajeOk('Categoria actualizada con exito')
                } else {
                    setCategorias([...categorias, guardada])
                    setMensajeOk('Categoria agregada con exito')
                }
                setMostrarForm(false)
                limpiarFormulario()
            })
            .catch(error => setErrorForm(traducirErrorForm(error.message)))
            .finally(() => setGuardando(false))
    }

    function cambiarVista() {
        setVerInactivas(!verInactivas)
        setMostrarForm(false)
        limpiarFormulario()
        setErrorForm('')
        setMensajeOk('')
    }

    // Si ya hay otra categoria activa con la misma descripcion, el back responde 400
    function traducirErrorReactivar(mensaje) {
        if (mensaje === 'Error 400') return 'No se pudo reactivar: ya existe otra categoria con esa descripcion'
        if (mensaje === 'Error 404') return 'Esa categoria ya no existe'
        return mensaje
    }

    // Vuelve a dar de alta una categoria: el mismo PUT de la baja, pero con active: true
    function handleReactivar(categoria) {
        setMensajeOk('')
        setError('')

        api('/categories/' + categoria.id, {
            method: 'PUT',
            body: JSON.stringify({ description: categoria.description, active: true })
        })
            .then(() => {
                setCategorias(categorias.filter(c => c.id !== categoria.id))
                setMensajeOk('Categoria reactivada')
            })
            .catch(error => setError(traducirErrorReactivar(error.message)))
    }

    // El back no deja dar de baja una categoria que todavia tiene productos activos (409)
    function traducirErrorBaja(mensaje) {
        if (mensaje === 'Error 409') return 'No se puede dar de baja: la categoria todavia tiene productos activos'
        if (mensaje === 'Error 404') return 'Esa categoria ya no existe'
        return mensaje
    }

    // La baja es logica: el mismo PUT de la edicion, pero con active: false
    function handleBaja(categoria) {
        if (!window.confirm('Seguro queres dar de baja "' + categoria.description + '"?')) return
        setMensajeOk('')
        setError('')

        api('/categories/' + categoria.id, {
            method: 'PUT',
            body: JSON.stringify({ description: categoria.description, active: false })
        })
            .then(() => {
                setCategorias(categorias.filter(c => c.id !== categoria.id))
                setMensajeOk('Categoria dada de baja')
            })
            .catch(error => setError(traducirErrorBaja(error.message)))
    }

    return (
        <>
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
