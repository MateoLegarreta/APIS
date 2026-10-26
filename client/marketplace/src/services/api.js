// Unico punto por donde el front le habla al backend. Envuelve a fetch para no
// repetir en cada pantalla el token, las cabeceras y el control de errores
export function api(ruta, opciones ={}) {
    // El token que guardo el login. Sin el, los endpoints privados responden 403
    const token = localStorage.getItem('token');

    // Las fotos se mandan como FormData y ahi el content-type lo pone el navegador
    const esArchivo = opciones.body instanceof FormData;

    

    return fetch(ruta, {
      // Lo que manda la pantalla (method, body) pasa tal cual
      ...opciones,
      headers: {
          ...(!esArchivo && { 'content-type': 'application/json' }),
          ...(token && { 'authorization': `Bearer ${token}` }),
          ...opciones.headers,
      }
  })
    .then(respuesta => {
        // fetch no falla solo cuando el servidor contesta mal: para el la respuesta
        // llego igual. Hay que mirar el ok a mano y lanzar el error nosotros
        if (!respuesta.ok) {
            // 403 es sesion vencida o sin permisos: conviene un mensaje claro
            if (respuesta.status === 403) {
                throw new Error('Tu sesion expiró, por favor inicia sesión nuevamente');
            }
            throw new Error('Error ' + respuesta.status );

        }
        // 204 = sin contenido (un DELETE, por ejemplo). Llamar a json() reventaria
        if (respuesta.status === 204) return null;

        // Convierte el cuerpo de la respuesta en un objeto JavaScript
        return respuesta.json();
    })
}
        