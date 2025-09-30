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

//створення кімнати
export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    async (roomData, { rejectWithValue }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Імітація затримки

        //нова кімната з унікальним айді
        const newRoom = {
            id: 'r' + nextRoomId++,
            ...roomData,
            capacity: Number(roomData.capacity) || 0,
        };

        console.log("Створено нову кімнату:", newRoom);
        return newRoom;
    }
);

//редагування
export const updateRoom = createAsyncThunk(
    'rooms/updateRoom',
    async (roomData, { rejectWithValue }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Імітація затримки

        //перевірка наявності айді
        if (!roomData.id) {
            return rejectWithValue("Не вдалося знайти ID кімнати для оновлення.");
        }

        console.log(`Оновлено кімнату ${roomData.id} з даними:`, roomData);
        return { ...roomData, capacity: Number(roomData.capacity) || 0 };
    }
);

//видалення кімнати
export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (roomId, { rejectWithValue }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Імітація затримки

        //повернення айді видаленої кімнати
        console.log("Видалено кімнату з ID:", roomId);
        return roomId;
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //створення
            .addCase(createRoom.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
                state.loadingStatus = 'succeeded';
            })
            .addCase(createRoom.pending, (state) => {
                state.loadingStatus = 'loading';
                state.error = null;
            })

            //редагування
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload; // Замінюємо оновленими даними
                }
                state.loadingStatus = 'succeeded';
            })

            //видалення
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
                state.loadingStatus = 'succeeded';
            })

            //обробка помилок та звантажень
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => { state.loadingStatus = 'loading'; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loadingStatus = 'failed';
                    state.error = action.error.message || action.payload || 'Операція не вдалася';
                }
            );
    },
});

export default roomsSlice.reducer;