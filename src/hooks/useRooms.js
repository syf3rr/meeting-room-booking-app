import { useDispatch, useSelector } from 'react-redux';
import * as roomsActions from '../redux/rooms/roomsSlice';

export function useRooms() {
    const dispatch = useDispatch();
    const roomsState = useSelector(state => state.rooms);

    const loadRooms = () => dispatch(roomsActions.fetchRooms());
    const createRoom = (data) => dispatch(roomsActions.createRoom(data));
    const updateRoom = (dataWithId) => dispatch(roomsActions.updateRoom(dataWithId));
    const deleteRoom = (id) => dispatch(roomsActions.deleteRoom(id));

    return {
        ...roomsState,
        loadRooms,
        createRoom,
        updateRoom,
        deleteRoom,
    };
}


