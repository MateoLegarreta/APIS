export function api(ruta, opciones ={}) {
    const token = localStorage.getItem('token');
    const esArchivo = opciones.body instanceof FormData;

    

    return fetch(ruta, {
      ...opciones,
      headers: {
          ...(!esArchivo && { 'content-type': 'application/json' }),
          ...(token && { 'authorization': `Bearer ${token}` }),
          ...opciones.headers,
      }
  })
    .then(respuesta => {
        if (!respuesta.ok) {
            if (respuesta.status === 403) {
                throw new Error('Tu sesion expiró, por favor inicia sesión nuevamente');
            }
            throw new Error('Error ' + respuesta.status );

        }
        if (respuesta.status === 204) return null;
        return respuesta.json();
    })
}
        