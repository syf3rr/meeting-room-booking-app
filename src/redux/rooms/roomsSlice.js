import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialRooms = [
    { id: 'r1', name: 'Кімната 1', description: 'Головна переговорна, 12 місць, проектор', capacity: 12 },
    { id: 'r2', name: 'Кімната 2', description: 'Мала кімната, 4 місця, ідеально для one-to-one', capacity: 4 },
    { id: 'r3', name: 'Кімната 3', description: 'Для командних зустрічей, 8 місць, дошка', capacity: 8 },
];

let nextRoomId = 4;

const initialState = {
    rooms: initialRooms,
    loadingStatus: 'idle',
    error: null,
};

export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Імітація затримки
        return initialRooms;
    }
);

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    async (roomData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newRoom = {
            id: 'r' + nextRoomId++,
            ...roomData,
            capacity: Number(roomData.capacity) || 0,
        };
        return newRoom;
    }
);

export const updateRoom = createAsyncThunk(
    'rooms/updateRoom',
    async (roomData, { rejectWithValue }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!roomData.id) {
            return rejectWithValue("Не вдалося знайти ID кімнати для оновлення.");
        }
        return { ...roomData, capacity: Number(roomData.capacity) || 0 };
    }
);

export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (roomId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return roomId;
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
                state.loadingStatus = 'succeeded';
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
                state.loadingStatus = 'succeeded';
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload;
                }
                state.loadingStatus = 'succeeded';
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
                state.loadingStatus = 'succeeded';
            })
            .addMatcher(
                (action) => action.type.startsWith('rooms/') && action.type.endsWith('/pending'),
                (state) => { state.loadingStatus = 'loading'; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.startsWith('rooms/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loadingStatus = 'failed';
                    state.error = action.error.message || action.payload || 'Операція не вдалася';
                }
            );
    },
});

export default roomsSlice.reducer;