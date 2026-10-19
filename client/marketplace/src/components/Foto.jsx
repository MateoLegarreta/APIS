import { useState, useEffect } from 'react'

// El backend guarda solo los bytes de la foto, no guarda si es un jpg o un png.
// Por suerte cada formato arranca con una firma propia que queda visible en los
// primeros caracteres del Base64, asi que se puede deducir de ahi
function tipoDeImagen(base64) {
    if (base64.startsWith('iVBOR'))  return 'image/png'
    if (base64.startsWith('R0lGOD')) return 'image/gif'
    if (base64.startsWith('UklGR'))  return 'image/webp'
    return 'image/jpeg'
}

// Pide la foto a GET /images/{id} y la muestra. Si el producto no tiene foto
// o el pedido falla, muestra un cartel en vez de una imagen rota
function Foto({ imageId, alt, tamanio }) {
    const [base64, setBase64] = useState('')
    const [fallo, setFallo] = useState(false)

    useEffect(() => {
        setBase64('')
        setFallo(false)

        // Un producto sin foto no tiene imageId, no hay nada que pedir
        if (!imageId) return

        fetch('/images/' + imageId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la imagen ' + imageId)
                }
                return response.json()
            })
            .then(data => setBase64(data.file))
            .catch(error => {
                setFallo(true)
                console.error(error)
            })
    }, [imageId])

    // Los estilos van aca solo para que la foto no salga gigante.
    // Cuando hagamos el CSS esto se mueve a una clase
    const medidas = { width: tamanio, height: tamanio, objectFit: 'cover' }

    if (!imageId || fallo) {
        return <div style={medidas}>Sin foto</div>
    }

    if (base64 === '') {
        return <div style={medidas}>Cargando foto...</div>
    }

    return (
        <img
            src={'data:' + tipoDeImagen(base64) + ';base64,' + base64}
            alt={alt}
            style={medidas}
        />
    )
}

export default Foto
