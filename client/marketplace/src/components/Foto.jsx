import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchImage } from '../redux/imageSlice'

// El backend guarda solo los bytes de la foto, no guarda si es un jpg o un png.
// Por suerte cada formato arranca con una firma propia que queda visible en los
// primeros caracteres del Base64, asi que se puede deducir de ahi
function tipoDeImagen(base64) {
    if (base64.startsWith('iVBOR'))  return 'image/png'
    if (base64.startsWith('R0lGOD')) return 'image/gif'
    if (base64.startsWith('UklGR'))  return 'image/webp'
    return 'image/jpeg'
}

// Muestra la foto de un producto. Si ya se pidio antes, sale directo del store;
// si no, la pide. Si el producto no tiene foto o el pedido falla, muestra un
// cartel en vez de una imagen rota
function Foto({ imageId, alt, tamanio }) {
    const dispatch = useDispatch()
    const base64 = useSelector((state) => state.images.porId[imageId])
    const fallo = useSelector((state) => state.images.fallidas[imageId] === true)

    useEffect(() => {
        // Un producto sin foto no tiene imageId, no hay nada que pedir.
        // Si ya esta guardada o se esta pidiendo, fetchImage no hace nada
        if (imageId) {
            dispatch(fetchImage(imageId))
        }
    }, [imageId, dispatch])

    // "tamanio" es el maximo: la foto ocupa el ancho que tenga disponible hasta
    // ese tope, y siempre es cuadrada. El resto del estilo esta en .foto (App.css)
    const medidas = { maxWidth: tamanio }

    if (!imageId || fallo) {
        return <div className="foto foto-vacia" style={medidas}>Sin foto</div>
    }

    if (base64 === undefined) {
        return <div className="foto foto-vacia" style={medidas} aria-label="Cargando foto" />
    }

    return (
        <img
            className="foto"
            src={'data:' + tipoDeImagen(base64) + ';base64,' + base64}
            alt={alt}
            style={medidas}
        />
    )
}

export default Foto
