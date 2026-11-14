import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, errorAMensaje } from './helpers'

const URL = '/products'

// Cuantos productos se muestran por pagina
export const TAMANIO = 6

// ---------- Catalogo (publico) ----------

// Pide una pagina del catalogo con los filtros que esten puestos.
// Se guardan pagina y filtros junto con el resultado, asi al volver al
// catalogo se muestra lo mismo sin pedirlo otra vez
export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ filtros, pagina }) => {
    const { data } = await axios.get(URL, { params: { ...filtros, page: pagina, size: TAMANIO } })
    return { ...data, filtros, pagina }
})

// Todos los productos activos de una sola vez (sin page ni size el back
// devuelve todos). Los usa el inicio para armar una fila por categoria:
// un solo pedido en vez de uno por categoria
export const fetchAllProducts = createAsyncThunk('products/fetchAllProducts', async () => {
    const { data } = await axios.get(URL)
    return data.content
})

// Pide un solo producto. Solo se usa cuando no esta ya en la lista
// (por ejemplo si se entra directo a /producto/5 o se refresca la pagina)
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
    try {
        const { data } = await axios.get(`${URL}/${id}`)
        return data
    } catch (error) {
        throw errorAMensaje(error, { 404: 'El producto no existe' })
    }
})

// ---------- Fotos ----------

// Pide la foto de un producto por su id. Las fotos ya pedidas quedan guardadas
// en el store, asi la misma foto no se vuelve a pedir al pasar de pantalla.
// "condition" se fija ANTES de hacer el pedido: si devuelve false, el thunk
// no se ejecuta. Hace falta aca porque varias tarjetas pueden pedir la misma
// foto al mismo tiempo (por ejemplo el mismo producto en el inicio y en el carrito)
export const fetchImage = createAsyncThunk(
    'products/fetchImage',
    async (id) => {
        const { data } = await axios.get(`/images/${id}`)
        return data.file
    },
    {
        condition: (id, { getState }) => {
            const { imagenes, imagenesPedidas } = getState().products
            return imagenes[id] === undefined && !imagenesPedidas[id]
        },
    },
)

// ---------- Panel de admin ----------

// La lista completa (sin paginar) de activos o de dados de baja
export const fetchAdminProducts = createAsyncThunk('products/fetchAdminProducts', async (inactivos, { getState }) => {
    try {
        const { data } = await axios.get(inactivos ? `${URL}/inactive` : URL, conToken(getState))
        return data.content
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Alta o edicion. Son dos pedidos: primero se sube la foto (si se eligio una)
// y con el id que devuelve se manda el producto. POST si es nuevo, PUT si tiene id
export const saveProduct = createAsyncThunk('products/saveProduct', async ({ id, datos, archivo }, { getState }) => {
    try {
        let imageId = datos.imageId
        if (archivo) {
            const formData = new FormData()
            formData.append('file', archivo)
            const { data } = await axios.post('/images', formData, conToken(getState))
            imageId = data.id
        }

        const producto = { ...datos, imageId }
        const { data } = id
            ? await axios.put(`${URL}/${id}`, producto, conToken(getState))
            : await axios.post(URL, producto, conToken(getState))
        return data
    } catch (error) {
        throw errorAMensaje(error)
    }
})

// Baja y reactivacion son el mismo PUT, cambiando solo "active".
// No hay DELETE: los pedidos viejos apuntan al producto y se romperia el historial
export const changeProductStatus = createAsyncThunk('products/changeProductStatus', async ({ producto, active }, { getState }) => {
    try {
        await axios.put(`${URL}/${producto.id}`, {
            name: producto.name,
            description: producto.description,
            price: producto.price,
            stock: producto.stock,
            categoryId: producto.category.id,
            imageId: producto.imageId,
            active,
        }, conToken(getState))
        return producto.id
    } catch (error) {
        // Al reactivar, el 404 significa que la categoria del producto esta dada de baja
        throw errorAMensaje(error, active
            ? { 404: 'No se pudo reactivar: la categoria del producto esta dada de baja. Reactivala primero en Admin categorias' }
            : {})
    }
})

// Si el admin cambio un producto, lo que estaba guardado del catalogo quedo
// viejo: se marca para que se vuelva a pedir la proxima vez que se entre
function invalidarCatalogo(state) {
    state.cargado = false
    state.todosCargado = false
    state.detalle = null
}

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
        // Si ya se pidio el catalogo alguna vez. Con esto no se vuelve a pedir
        // cada vez que se entra a la pantalla
        cargado: false,
        pagina: 0,
        totalPaginas: 0,
        filtros: {},
        // Todos los productos, para el inicio
        todos: [],
        todosLoading: false,
        todosCargado: false,
        // Las fotos: id de la imagen -> la foto en Base64
        imagenes: {},
        // id -> true mientras se esta pidiendo, para no pedirla dos veces
        imagenesPedidas: {},
        // id -> true si fallo
        imagenesFallidas: {},
        // El producto que se pidio suelto por id
        detalle: null,
        detalleLoading: false,
        detalleError: null,
        // La lista del panel de admin
        adminItems: [],
        adminLoading: false,
        adminError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.cargado = true
                state.items = action.payload.content
                state.totalPaginas = action.payload.totalPages
                state.pagina = action.payload.pagina
                state.filtros = action.payload.filtros
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.loading = false
                state.error = 'No se pudieron cargar los productos. Fijate que el backend este levantado.'
            })
            .addCase(fetchAllProducts.pending, (state) => {
                state.todosLoading = true
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.todosLoading = false
                state.todosCargado = true
                state.todos = action.payload
            })
            .addCase(fetchAllProducts.rejected, (state) => {
                state.todosLoading = false
            })
            .addCase(fetchProductById.pending, (state) => {
                state.detalleLoading = true
                state.detalleError = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.detalleLoading = false
                state.detalle = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.detalleLoading = false
                state.detalleError = action.error.message
            })
            // action.meta.arg es lo que se le paso al thunk: el id de la foto
            .addCase(fetchImage.pending, (state, action) => {
                state.imagenesPedidas[action.meta.arg] = true
            })
            .addCase(fetchImage.fulfilled, (state, action) => {
                delete state.imagenesPedidas[action.meta.arg]
                state.imagenes[action.meta.arg] = action.payload
            })
            .addCase(fetchImage.rejected, (state, action) => {
                delete state.imagenesPedidas[action.meta.arg]
                state.imagenesFallidas[action.meta.arg] = true
            })
            .addCase(fetchAdminProducts.pending, (state) => {
                state.adminLoading = true
                state.adminError = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminItems = action.payload
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.adminLoading = false
                state.adminError = action.error.message
            })
            // Se actualiza la lista en pantalla con lo que devolvio el back,
            // sin volver a pedirla entera
            .addCase(saveProduct.fulfilled, (state, action) => {
                const guardado = action.payload
                const existe = state.adminItems.some((p) => p.id === guardado.id)
                state.adminItems = existe
                    ? state.adminItems.map((p) => (p.id === guardado.id ? guardado : p))
                    : [...state.adminItems, guardado]
                invalidarCatalogo(state)
            })
            // Dado de baja o reactivado, el producto sale de la lista que se esta viendo
            .addCase(changeProductStatus.fulfilled, (state, action) => {
                state.adminItems = state.adminItems.filter((p) => p.id !== action.payload)
                invalidarCatalogo(state)
            })
    },
})

export default productSlice.reducer
