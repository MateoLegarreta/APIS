
export function conToken(getState) {
    return { headers: { Authorization: `Bearer ${getState().auth.token}` } }
}


export function errorAMensaje(error, mensajes = {}) {
    const status = error.response?.status

    if (mensajes[status]) return new Error(mensajes[status])
    if (status === 403) return new Error('Tu sesion expiró, por favor inicia sesión nuevamente')
    if (status) return new Error('Error ' + status)
    return new Error('No se pudo conectar con el servidor')
}
