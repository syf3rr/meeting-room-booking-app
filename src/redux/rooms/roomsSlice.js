import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const ROOMS_STORAGE_KEY = 'meeting_rooms_data';

const loadRooms = () => {
    try {
        const serializedState = localStorage.getItem(ROOMS_STORAGE_KEY);
        if (serializedState === null) {
            return [
                { id: 'r1', name: 'Кімната 1', description: 'Головна переговорна, 12 місць, проектор', capacity: 12 },
                { id: 'r2', name: 'Кімната 2', description: 'Мала кімната, 4 місця, ідеально для one-to-one', capacity: 4 },
                { id: 'r3', name: 'Кімната 3', description: 'Для командних зустрічей, 8 місць, дошка', capacity: 8 },
            ];
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load rooms state from localStorage:", e);
        return [];
    }
};

const saveRooms = (rooms) => {
    try {
        const serializedState = JSON.stringify(rooms);
        localStorage.setItem(ROOMS_STORAGE_KEY, serializedState);
    } catch (e) {
        console.error("Could not save rooms state to localStorage:", e);
    }
};

let initialRoomsState = loadRooms();
let nextRoomId = initialRoomsState.length > 0 ? (Math.max(...initialRoomsState.map(r => parseInt(r.id.substring(1)))) + 1) : 1;

export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadRooms();
    }
);

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    async (roomData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newRoom = { ...roomData, id: `r${nextRoomId++}`, capacity: Number(roomData.capacity) };

        const currentRooms = loadRooms();
        currentRooms.push(newRoom);
        saveRooms(currentRooms);

        return newRoom;
    }
);

export const updateRoom = createAsyncThunk(
    'rooms/updateRoom',
    async (updatedRoom) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const rooms = loadRooms();
        const index = rooms.findIndex(r => r.id === updatedRoom.id);
        if (index !== -1) {
            const updated = { ...updatedRoom, capacity: Number(updatedRoom.capacity) };
            rooms[index] = updated;
            saveRooms(rooms);
            return updated;
        }
        throw new Error('Кімнату не знайдено.');
    }
);

export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (roomId) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const rooms = loadRooms();
        const updatedRooms = rooms.filter(r => r.id !== roomId);

        if (updatedRooms.length < rooms.length) {
            saveRooms(updatedRooms);
            return roomId;
        }
        throw new Error('Кімнату не знайдено.');
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: {
        rooms: initialRoomsState,
        loadingStatus: 'idle',
        error: null,
    },
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