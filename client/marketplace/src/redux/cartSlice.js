import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'
import { logout } from './userSlice'

const URL = '/cart'

// Que significa cada codigo cuando se cambia una cantidad
const ERRORES_CANTIDAD = {
    409: 'No hay stock suficiente para esa cantidad',
    400: 'La cantidad indicada es invalida',
}

// El carrito se pide UNA vez (al iniciar sesion). Despues, cada accion
// (agregar, cambiar, quitar) devuelve el carrito ya actualizado y con eso
// se reemplaza el del store: no hace falta volver a pedirlo
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
    try {
        const { data } = await axios.get(URL, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { getState }) => {
    try {
        const { data } = await axios.post(`${URL}/items`, { productId, quantity }, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error, ERRORES_CANTIDAD)
    }
})

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { getState }) => {
    try {
        const { data } = await axios.put(`${URL}/items/${productId}`, { quantity }, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error, ERRORES_CANTIDAD)
    }
})

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId, { getState }) => {
    try {
        const { data } = await axios.delete(`${URL}/items/${productId}`, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Este endpoint no devuelve el carrito, solo un mensaje: el vaciado se hace a mano
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
    try {
        await axios.delete(URL, conToken(getState))
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Crea el pedido con lo que hay en el carrito. Devuelve el pedido nuevo
export const checkout = createAsyncThunk('cart/checkout', async (_, { getState }) => {
    try {
        const { data } = await axios.post(`${URL}/checkout`, null, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error, {
            409: 'Algun producto ya no tiene stock suficiente. Revisa las cantidades del carrito',
            400: 'El carrito esta vacio',
        })
    }
})

const estadoInicial = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    cargado: false,
}

// Guarda el carrito que devolvio el back
function guardarCarrito(state, action) {
    state.cargado = true
    state.items = action.payload.items
    state.total = action.payload.total
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                guardarCarrito(state, action)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            // Las tres acciones que devuelven el carrito se manejan igual
            .addCase(addToCart.fulfilled, guardarCarrito)
            .addCase(updateCartItem.fulfilled, guardarCarrito)
            .addCase(removeCartItem.fulfilled, guardarCarrito)

            .addCase(clearCart.fulfilled, (state) => {
                state.items = []
                state.total = 0
            })
            // Despues de comprar el back vacia el carrito: aca se hace lo mismo
            .addCase(checkout.fulfilled, (state) => {
                state.items = []
                state.total = 0
            })

            // Al cerrar sesion se borra el carrito, asi no queda el del usuario anterior
            .addCase(logout, () => estadoInicial)
    },
})

export default cartSlice.reducer
