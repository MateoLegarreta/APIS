import { createContext, useContext, useState } from 'react'

// Guarda el estado de la sesion en un solo lugar, para que lo puedan usar
// todos los componentes sin pasarselo por props de uno a otro
const AuthContext = createContext()

export function AuthProvider({ children }) {

    // Arranca fijandose si ya habia un token guardado de antes,
    // asi al refrescar la pagina no se pierde la sesion
    const [logueado, setLogueado] = useState(localStorage.getItem('token') !== null)

    // Guarda el token y marca que hay sesion
    function login(token) {
        localStorage.setItem('token', token)
        setLogueado(true)
    }

    // Borra el token y marca que no hay sesion
    function logout() {
        localStorage.removeItem('token')
        setLogueado(false)
    }

    return (
        <AuthContext.Provider value={{ logueado, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Atajo para que cualquier componente lea la sesion con una sola linea
export function useAuth() {
    return useContext(AuthContext)
}