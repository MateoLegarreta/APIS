import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'
import imageReducer from './imageSlice'
import userReducer from './userSlice'

// El estado global de la app. Cada slice maneja su parte
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        orders: orderReducer,
        images: imageReducer,
        users: userReducer,
    },
})
