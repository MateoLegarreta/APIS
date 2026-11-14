import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'

// El estado global de la app. Cada slice maneja su parte
export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        orders: orderReducer,
    },
})
