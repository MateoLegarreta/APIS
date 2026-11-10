import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'

const URL = '/categories'

// Las categorias activas, para los desplegables (catalogo y formulario de productos).
// Sin page ni size el back devuelve todas
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const { data } = await axios.get(URL)
    return data
})

// ---------- Panel de admin ----------

export const fetchAdminCategories = createAsyncThunk('categories/fetchAdminCategories', async (inactivas, { getState }) => {
    try {
        const { data } = await axios.get(inactivas ? `${URL}/inactive` : URL, conToken(getState))
        return data.content
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Alta (POST) o edicion (PUT si viene id)
export const saveCategory = createAsyncThunk('categories/saveCategory', async ({ id, description }, { getState }) => {
    try {
        const { data } = id
            ? await axios.put(`${URL}/${id}`, { description }, conToken(getState))
            : await axios.post(URL, { description }, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error, {
            400: 'Ya existe una categoria con esa descripcion',
            404: 'Esa categoria ya no existe',
        })
    }
})

// Baja o reactivacion: el mismo PUT cambiando "active"
export const changeCategoryStatus = createAsyncThunk('categories/changeCategoryStatus', async ({ categoria, active }, { getState }) => {
    try {
        await axios.put(`${URL}/${categoria.id}`, { description: categoria.description, active }, conToken(getState))
        return categoria.id
    } catch (error) {
        throw errorAMensaje(error, active
            ? { 400: 'No se pudo reactivar: ya existe otra categoria con esa descripcion', 404: 'Esa categoria ya no existe' }
            : { 409: 'No se puede dar de baja: la categoria todavia tiene productos activos', 404: 'Esa categoria ya no existe' })
    }
})

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        loading: false,
        error: null,
        cargado: false,
        // La lista del panel de admin
        adminItems: [],
        adminLoading: false,
        adminError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.cargado = true
                // Solo se guarda si de verdad vino una lista: si no, el .map
                // del desplegable reventaria y se caeria toda la pantalla
                state.items = Array.isArray(action.payload.content) ? action.payload.content : []
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchAdminCategories.pending, (state) => {
                state.adminLoading = true
                state.adminError = null
            })
            .addCase(fetchAdminCategories.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminItems = action.payload
            })
            .addCase(fetchAdminCategories.rejected, (state, action) => {
                state.adminLoading = false
                state.adminError = action.error.message
            })
            // En los dos casos los desplegables quedaron viejos: cargado = false
            // hace que se vuelvan a pedir la proxima vez
            .addCase(saveCategory.fulfilled, (state, action) => {
                const guardada = action.payload
                const existe = state.adminItems.some((c) => c.id === guardada.id)
                state.adminItems = existe
                    ? state.adminItems.map((c) => (c.id === guardada.id ? guardada : c))
                    : [...state.adminItems, guardada]
                state.cargado = false
            })
            .addCase(changeCategoryStatus.fulfilled, (state, action) => {
                state.adminItems = state.adminItems.filter((c) => c.id !== action.payload)
                state.cargado = false
            })
    },
})

export default categorySlice.reducer
