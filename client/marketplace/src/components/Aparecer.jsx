import { useEffect, useRef, useState } from 'react'

// Envuelve un bloque para que aparezca suavemente cuando entra en pantalla
// al scrollear. IntersectionObserver es una herramienta del navegador que
// avisa cuando un elemento se vuelve visible, sin tener que escuchar el scroll
function Aparecer({ children }) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observador = new IntersectionObserver(([entrada]) => {
            if (entrada.isIntersecting) {
                setVisible(true)
                // Una vez que aparecio no hace falta seguir mirando
                observador.disconnect()
            }
        }, { threshold: 0.15 })

        observador.observe(ref.current)
        return () => observador.disconnect()
    }, [])

    return (
        <div ref={ref} className={'aparecer' + (visible ? ' visible' : '')}>
            {children}
        </div>
    )
}

export default Aparecer
