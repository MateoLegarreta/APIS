import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'

const URL_AUTH = '/api/v1/auth'
const URL = '/users'

// Todo lo del usuario vive en este slice: la sesion (token y rol, que se
// consiguen al iniciar sesion o registrarse) y, para el admin, la lista de usuarios

// ---------- Sesion ----------

// Pide el token con email y contraseña. Se guarda tambien en localStorage
// para que la sesion no se pierda al refrescar la pagina
export const login = createAsyncThunk('user/login', async ({ email, password }) => {
    try {
        const { data } = await axios.post(`${URL_AUTH}/authenticate`, { email, password })
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('rol', data.role)
        return data
    } catch (error) {
        throw errorAMensaje(error, { 403: 'Usuario o contraseña incorrectos' })
    }
})

// Crea la cuenta. El back devuelve un token igual que el login,
// asi que el usuario queda con la sesion iniciada
export const register = createAsyncThunk('user/register', async (datos) => {
    try {
        const { data } = await axios.post(`${URL_AUTH}/register`, datos)
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('rol', data.role)
        return data
    } catch (error) {
        throw errorAMensaje(error, { 400: 'Ya existe un usuario con ese email' })
    }
})

// ---------- Panel de admin ----------

// Todos los usuarios, activos y dados de baja (solo admin)
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { getState }) => {
    try {
        const { data } = await axios.get(URL, conToken(getState))
        return data.content
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Da de baja o reactiva: manda el PUT con el "active" invertido
export const changeUserStatus = createAsyncThunk('user/changeUserStatus', async (usuario, { getState }) => {
    try {
        const { data } = await axios.put(`${URL}/${usuario.id}`, {
            email: usuario.email,
            name: usuario.name,
            surname: usuario.surname,
            active: !usuario.active,
        }, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        // La sesion. Arranca con lo que habia guardado de antes
        token: localStorage.getItem('token'),
        rol: localStorage.getItem('rol'),
        loading: false,
        error: null,
        // La lista de usuarios del panel de admin
        lista: [],
        listaLoading: false,
        listaError: null,
    },
    reducers: {
        // Cerrar sesion no llama al back: solo se borra el token
        logout: (state) => {
            localStorage.removeItem('token')
            localStorage.removeItem('rol')
            state.token = null
            state.rol = null
            state.lista = []
        },
        // Para que el error de una pantalla no aparezca al entrar a la otra
        limpiarError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.rol = action.payload.role
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.rol = action.payload.role
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchUsers.pending, (state) => {
                state.listaLoading = true
                state.listaError = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.listaLoading = false
                state.lista = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.listaLoading = false
                state.listaError = action.error.message
            })
            // Se reemplaza solo el usuario que cambio, con lo que devolvio el back
            .addCase(changeUserStatus.fulfilled, (state, action) => {
                state.lista = state.lista.map((u) => (u.id === action.payload.id ? action.payload : u))
            })
    },
})

export const { logout, limpiarError } = userSlice.actions
export default userSlice.reducer
