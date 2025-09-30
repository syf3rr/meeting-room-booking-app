import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let nextBookingId = 3;
const MOCK_BOOKINGS = [
    {
        id: 'b1',
        roomId: 'r2',
        title: 'Запуск Проекту Альфа',
        description: 'Фінальна зустріч перед запуском.',
        startTime: '2025-10-01T10:00:00',
        endTime: '2025-10-01T11:00:00',
        userName: 'Іван Петренко'
    },
    {
        id: 'b2',
        roomId: 'r2',
        title: 'Щоденний стендап',
        description: 'Коротке оновлення статусу.',
        startTime: '2025-10-01T14:00:00',
        endTime: '2025-10-01T14:15:00',
        userName: 'Олена Коваль'
    }
];

const initialState = {
    bookings: MOCK_BOOKINGS,
    loadingStatus: 'idle',
    error: null,
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_BOOKINGS;
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData, { getState, rejectWithValue }) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newBooking = {
            id: 'b' + nextBookingId++,
            ...bookingData,
        };
        return newBooking;
    }
);

export const updateBooking = createAsyncThunk(
    'bookings/updateBooking',
    async (bookingData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return bookingData;
    }
);

export const deleteBooking = createAsyncThunk(
    'bookings/deleteBooking',
    async (bookingId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return bookingId;
    }
);


const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
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
            // Обробка станів завантаження/помилок
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