import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import roomsReducer from './rooms/roomsSlice';
import bookingsReducer from './bookings/bookingsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomsReducer,
        bookings: bookingsReducer,
    },
});

export default store;