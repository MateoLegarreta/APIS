import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const URL = '/images'

// Pide una foto por id. Las fotos ya pedidas quedan guardadas en el store,
// asi la misma foto no se vuelve a pedir al pasar de pantalla.
// "condition" se fija ANTES de hacer el pedido: si devuelve false, el thunk
// no se ejecuta. Hace falta aca porque varias tarjetas pueden pedir la misma
// foto al mismo tiempo (por ejemplo el mismo producto en el carrito y en el detalle)
export const fetchImage = createAsyncThunk(
    'images/fetchImage',
    async (id) => {
        const { data } = await axios.get(`${URL}/${id}`)
        return data.file
    },
    {
        condition: (id, { getState }) => {
            const { porId, pedidas } = getState().images
            return porId[id] === undefined && !pedidas[id]
        },
    },
)

const imageSlice = createSlice({
    name: 'images',
    initialState: {
        // id de la imagen -> la foto en Base64
        porId: {},
        // id -> true mientras se esta pidiendo
        pedidas: {},
        // id -> true si fallo
        fallidas: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // action.meta.arg es lo que se le paso al thunk: el id de la foto
            .addCase(fetchImage.pending, (state, action) => {
                state.pedidas[action.meta.arg] = true
            })
            .addCase(fetchImage.fulfilled, (state, action) => {
                delete state.pedidas[action.meta.arg]
                state.porId[action.meta.arg] = action.payload
            })
            .addCase(fetchImage.rejected, (state, action) => {
                delete state.pedidas[action.meta.arg]
                state.fallidas[action.meta.arg] = true
            })
    },
})

export default imageSlice.reducer
