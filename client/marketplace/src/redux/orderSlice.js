import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'
import { logout } from './authSlice'
import { checkout } from './cartSlice'

const URL = '/orders'

// "Mis pedidos" del usuario logueado
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
    try {
        const { data } = await axios.get(URL, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Un pedido suelto. Solo se usa si no esta ya en "mis pedidos" ni en las ventas
export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { getState }) => {
    try {
        const { data } = await axios.get(`${URL}/${id}`, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error, { 404: 'Ese pedido no existe' })
    }
})

// Todas las ventas del local (solo admin)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { getState }) => {
    try {
        const { data } = await axios.get(`${URL}/all`, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

const estadoInicial = {
    items: [],
    loading: false,
    error: null,
    cargado: false,
    detalle: null,
    detalleLoading: false,
    detalleError: null,
    ventas: [],
    ventasLoading: false,
    ventasError: null,
}

const orderSlice = createSlice({
    name: 'orders',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false
                state.cargado = true
                state.items = action.payload
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.detalleLoading = true
                state.detalleError = null
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.detalleLoading = false
                state.detalle = action.payload
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.detalleLoading = false
                state.detalleError = action.error.message
            })
            .addCase(fetchAllOrders.pending, (state) => {
                state.ventasLoading = true
                state.ventasError = null
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.ventasLoading = false
                state.ventas = action.payload
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.ventasLoading = false
                state.ventasError = action.error.message
            })
            // Al comprar, el pedido nuevo ya viene en la respuesta del checkout:
            // se agrega arriba de "mis pedidos" y queda como detalle, asi la
            // pantalla del pedido se muestra sin pedir nada
            .addCase(checkout.fulfilled, (state, action) => {
                if (state.cargado) state.items.unshift(action.payload)
                state.detalle = action.payload
            })
            // Al cerrar sesion se borra todo, asi no quedan los pedidos de otro usuario
            .addCase(logout, () => estadoInicial)
    },
})

export default orderSlice.reducer
