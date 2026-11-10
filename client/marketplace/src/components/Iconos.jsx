// Iconos dibujados con SVG. Van como componentes para usarlos como <IconoCarrito />.
// stroke="currentColor" hace que tomen el color del texto donde se pongan,
// asi no hay que pintarlos aparte en el CSS
function Svg({ children, tamanio = 22 }) {
    return (
        <svg width={tamanio} height={tamanio} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
             strokeLinejoin="round" aria-hidden="true">
            {children}
        </svg>
    )
}

export function IconoCarrito(props) {
    return (
        <Svg {...props}>
            <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" />
            <circle cx="9.5" cy="20" r="1.2" />
            <circle cx="17.5" cy="20" r="1.2" />
        </Svg>
    )
}

export function IconoUsuario(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
        </Svg>
    )
}

export function IconoBuscar(props) {
    return (
        <Svg {...props}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
        </Svg>
    )
}

export function IconoFlecha({ direccion = 'derecha', ...props }) {
    return (
        <Svg {...props}>
            {direccion === 'derecha'
                ? <path d="m9 5 7 7-7 7" />
                : <path d="m15 5-7 7 7 7" />}
        </Svg>
    )
}

export function IconoTarjeta(props) {
    return (
        <Svg {...props}>
            <rect x="3" y="5.5" width="18" height="13" rx="2" />
            <path d="M3 10h18M7 15h3" />
        </Svg>
    )
}

export function IconoReloj(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </Svg>
    )
}

export function IconoLocal(props) {
    return (
        <Svg {...props}>
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.3" />
        </Svg>
    )
}

export function IconoCheck(props) {
    return (
        <Svg {...props}>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </Svg>
    )
}
