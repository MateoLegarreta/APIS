import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'

const URL = '/users'

// Todos los usuarios, activos y dados de baja (solo admin)
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState }) => {
    try {
        const { data } = await axios.get(URL, conToken(getState))
        return data.content
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Da de baja o reactiva: manda el PUT con el "active" invertido
export const changeUserStatus = createAsyncThunk('users/changeUserStatus', async (usuario, { getState }) => {
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
    name: 'users',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            // Se reemplaza solo el usuario que cambio, con lo que devolvio el back
            .addCase(changeUserStatus.fulfilled, (state, action) => {
                state.items = state.items.map((u) => (u.id === action.payload.id ? action.payload : u))
            })
    },
})

export default userSlice.reducer
