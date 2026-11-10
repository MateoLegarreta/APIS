import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorAMensaje } from './helpers'

const URL = '/api/v1/auth'

// Pide el token con email y contraseña. Se guarda tambien en localStorage
// para que la sesion no se pierda al refrescar la pagina
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    try {
        const { data } = await axios.post(`${URL}/authenticate`, { email, password })
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('rol', data.role)
        return data
    } catch (error) {
        throw errorAMensaje(error, { 403: 'Usuario o contraseña incorrectos' })
    }
})

// Crea la cuenta. El back devuelve un token igual que el login,
// asi que el usuario queda con la sesion iniciada
export const register = createAsyncThunk('auth/register', async (datos) => {
    try {
        const { data } = await axios.post(`${URL}/register`, datos)
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('rol', data.role)
        return data
    } catch (error) {
        throw errorAMensaje(error, { 400: 'Ya existe un usuario con ese email' })
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // Arranca con lo que habia guardado de antes
        token: localStorage.getItem('token'),
        rol: localStorage.getItem('rol'),
        loading: false,
        error: null,
    },
    reducers: {
        // Cerrar sesion no llama al back: solo se borra el token
        logout: (state) => {
            localStorage.removeItem('token')
            localStorage.removeItem('rol')
            state.token = null
            state.rol = null
        },
        // Para que el error de una pantalla no aparezca al entrar a la otra
        limpiarErrorAuth: (state) => {
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
    },
})

export const { logout, limpiarErrorAuth } = authSlice.actions
export default authSlice.reducer
