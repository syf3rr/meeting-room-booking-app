import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import roomsReducer from './rooms/roomsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomsReducer,
    },
});

export default store;