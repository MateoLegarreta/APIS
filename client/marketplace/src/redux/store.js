import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['token', 'rol'], // Solo se persisten token y rol
}
// El estado global de la app. Cada slice maneja su parte
export const store = configureStore({
    reducer: {
        user: persistReducer(userPersistConfig, userReducer),
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        orders: orderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})
export const persistor = persistStore(store)