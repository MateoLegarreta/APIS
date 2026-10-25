import { useEffect, useState } from "react";
import { api } from "../../services/api";
import MenuAdmin from "../../components/MenuAdmin";

// Listado de usuarios. No hay alta: los usuarios se crean desde el registro.
// GET /users devuelve todos, activos y dados de baja, asi que van en una sola
// tabla y cada fila muestra su estado
function Users() {

    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [mensajeOk, setMensajeOk] = useState('')

    useEffect(() => {
        api('/users?size=100')
            .then(data => setUsuarios(data.content))
            .catch(error => setError(error.message))
            .finally(() => setCargando(false))
    }, [])

    function cambiarEstado(usuario){
        const dandoDeBaja= usuario.active
        const accion = dandoDeBaja ? 'dar de baja' : 'reactivar'

        if (!window.confirm('Seguro queres ' + accion + ' a ' + usuario.email + '?')) return

        setMensajeOk('')
        setError('')

        api('/users/' + usuario.id, {
            method: 'PUT',
            body: JSON.stringify({
                email: usuario.email,
                name: usuario.name,
                surname: usuario.surname,
                active: !usuario.active
            })
        })

        .then(actualizado => {
            setUsuarios(usuarios.map(u => u.id === usuario.id ? actualizado : u))
            setMensajeOk(dandoDeBaja ? 'Usuario dado de baja' : 'Usuario reactivado')
        })
        .catch(error => setError(error.message))
    }

    if (cargando) return <p>Cargando usuarios...</p>
    if (error) return <p className="mensaje-error">{error}</p>
    if (usuarios.length === 0) return <p className="mensaje-vacio">No hay usuarios</p>

    return (
        <>
            <MenuAdmin />
            <h1 className="titulo-seccion">Usuarios</h1>

            {mensajeOk && <p className="mensaje-ok">{mensajeOk}</p>}

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
