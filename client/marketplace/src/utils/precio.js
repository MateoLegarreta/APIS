// Muestra un numero como precio argentino: 48500 -> "$48.500".
// toLocaleString con 'es-AR' pone el punto de los miles y la coma decimal
export function precio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR', { maximumFractionDigits: 2 })
}
