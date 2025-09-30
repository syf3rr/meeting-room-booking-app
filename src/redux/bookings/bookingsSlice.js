import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BOOKINGS_STORAGE_KEY = 'meeting_bookings_data';

const loadBookings = () => {
    try {
        const serializedState = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        if (serializedState === null) {
            return [
                { id: 'b1', roomId: 'r2', title: 'Запуск Проекту Альфа', description: 'Фінальна зустріч перед запуском.', startTime: '2025-10-01T10:00:00', endTime: '2025-10-01T11:00:00', userName: 'Адміністратор', participants: ['user@app.com', 'team@app.com'] },
                { id: 'b2', roomId: 'r2', title: 'Щоденний стендап', description: 'Коротке оновлення статусу.', startTime: '2025-10-01T14:00:00', endTime: '2025-10-01T14:15:00', userName: 'Звичайний Користувач', participants: ['admin@app.com'] }
            ];
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load bookings state from localStorage:", e);
        return [];
    }
};

const saveBookings = (bookings) => {
    try {
        const serializedState = JSON.stringify(bookings);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, serializedState);
    } catch (e) {
        console.error("Could not save bookings state to localStorage:", e);
    }
};

let initialBookingsState = loadBookings();
let nextBookingId = initialBookingsState.length > 0 ? (Math.max(...initialBookingsState.map(b => parseInt(b.id.substring(1)))) + 1) : 1;

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadBookings();
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newBooking = { ...bookingData, id: `b${nextBookingId++}` };

        const currentBookings = loadBookings();
        currentBookings.push(newBooking);
        saveBookings(currentBookings);

        return newBooking;
    }
);

export const updateBooking = createAsyncThunk(
    'bookings/updateBooking',
    async (updatedBooking) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const bookings = loadBookings();
        const index = bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
            bookings[index] = updatedBooking;
            saveBookings(bookings);
            return updatedBooking;
        }
        throw new Error('Бронювання не знайдено.');
    }
);

export const deleteBooking = createAsyncThunk(
    'bookings/deleteBooking',
    async (bookingId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const bookings = loadBookings();
        const updatedBookings = bookings.filter(b => b.id !== bookingId);

        if (updatedBookings.length < bookings.length) {
            saveBookings(updatedBookings); // Зберігаємо
            return bookingId;
        }
        throw new Error('Бронювання не знайдено.');
    }
);

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings: initialBookingsState,
        loadingStatus: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.fulfilled, (state, action) => { state.bookings = action.payload; state.loadingStatus = 'succeeded'; })
            .addCase(createBooking.fulfilled, (state, action) => { state.bookings.push(action.payload); state.loadingStatus = 'succeeded'; })
            .addCase(updateBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) { state.bookings[index] = action.payload; }
                state.loadingStatus = 'succeeded';
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter(b => b.id !== action.payload);
                state.loadingStatus = 'succeeded';
            })
            .addMatcher(
                (action) => action.type.startsWith('bookings/') && action.type.endsWith('/pending'),
                (state) => { state.loadingStatus = 'loading'; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.startsWith('bookings/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loadingStatus = 'failed';
                    state.error = action.error.message || action.payload || 'Операція не вдалася';
                }
            );
    },
});

export default bookingsSlice.reducer;