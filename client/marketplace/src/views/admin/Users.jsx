import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, changeUserStatus } from "../../redux/userSlice";
import MenuAdmin from "../../components/MenuAdmin";

// Listado de usuarios. No hay alta: los usuarios se crean desde el registro.
// GET /users devuelve todos, activos y dados de baja, asi que van en una sola
// tabla y cada fila muestra su estado
function Users() {
    const dispatch = useDispatch()
    const { lista: usuarios, listaLoading: cargando, listaError: error } = useSelector((state) => state.user)
    const [mensajeOk, setMensajeOk] = useState('')
    // Error al dar de baja o reactivar. Va aparte para que la tabla siga a la vista
    const [errorAccion, setErrorAccion] = useState('')

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    // Un solo boton para las dos acciones: el slice manda el PUT con el active invertido
    // y reemplaza al usuario en la lista con lo que devuelve el back
    function cambiarEstado(usuario){
        const dandoDeBaja= usuario.active
        const accion = dandoDeBaja ? 'dar de baja' : 'reactivar'

        if (!window.confirm('Seguro queres ' + accion + ' a ' + usuario.email + '?')) return

        setMensajeOk('')
        setErrorAccion('')

        dispatch(changeUserStatus(usuario))
            .unwrap()
            .then(() => setMensajeOk(dandoDeBaja ? 'Usuario dado de baja' : 'Usuario reactivado'))
            .catch(error => setErrorAccion(error.message))
    }

    if (cargando && usuarios.length === 0) return <p>Cargando usuarios...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (usuarios.length === 0) return <p className="mensaje-vacio">No hay usuarios</p>

    return (
        <>
            <MenuAdmin />
            <h1 className="titulo-seccion">Usuarios</h1>

            {mensajeOk && <p className="mensaje-ok">{mensajeOk}</p>}
            {errorAccion && <p className="mensaje-error">{errorAccion}</p>}

            <table className="tabla">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id} className={usuario.active ? '' : 'fila-inactiva'}>
                            <td>{usuario.email}</td>
                            <td>{usuario.name} {usuario.surname}</td>
                            <td>{usuario.nickname}</td>
                            <td>{usuario.role}</td>
                            <td>{usuario.active ? 'Activo' : 'Dado de baja'}</td>
                            <td>
                                <div className="acciones">
                                    {/* Al admin no se le da de baja: se quedaria sin panel */}
                                    {usuario.role !== 'ADMIN' && (
                                        <button className='boton boton-secundario'
                                        onClick={() => cambiarEstado(usuario)}>
                                        {usuario.active ? 'Dar de baja' : 'Reactivar' }
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Users
