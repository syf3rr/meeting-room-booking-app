import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, deleteRoom } from '../../redux/rooms/roomsSlice.js';
import { fetchBookings, deleteBooking } from '../../redux/bookings/bookingsSlice.js';

const initialRoomState = { id: null, name: '', description: '', capacity: '' };
const initialBookingState = { id: null, roomId: null, title: '', description: '', startTime: '', endTime: '', userName: '', participants: [] };

export const useMeetingRoomsDashboard = () => {
    const dispatch = useDispatch();
    const { rooms, loadingStatus: roomsLoadingStatus, error: roomsError } = useSelector(state => state.rooms);
    const { bookings, loadingStatus: bookingsLoadingStatus, error: bookingsError } = useSelector(state => state.bookings);
    const { user, loadingStatus: authLoadingStatus } = useSelector(state => state.auth);

    const isAdmin = user?.role === 'Admin';
    const overallLoading = roomsLoadingStatus === 'loading' || bookingsLoadingStatus === 'loading' || authLoadingStatus === 'loading';

    // State for Dialogs and current items
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [targetRoomId, setTargetRoomId] = useState(null);

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchBookings());
    }, [dispatch]);

    const canManageBooking = (booking) => {
        // Дозволяє керувати бронюванням, якщо користувач є Адміном.
        if (!user) return false;
        if (isAdmin) return true;
        return false;
    };

    const canEditForParticipation = !!user;

    const handleOpenCreateRoom = () => {
        setCurrentRoom(null);
        setOpenRoomDialog(true);
    };

    const handleOpenEditRoom = (room) => {
        setCurrentRoom(room);
        setOpenRoomDialog(true);
    };

    const handleCloseRoomDialog = () => {
        setOpenRoomDialog(false);
        setCurrentRoom(null);
    };

    const handleDeleteRoom = (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю кімнату?')) {
            dispatch(deleteRoom(id));
        }
    };

    const handleOpenCreateBooking = (roomId) => {
        setCurrentBooking(null);
        setTargetRoomId(roomId);
        setOpenBookingDialog(true);
    };

    const handleOpenEditBooking = (booking) => {
        setCurrentBooking(booking);
        setTargetRoomId(booking.roomId);
        setOpenBookingDialog(true);
    };

    const handleCloseBookingDialog = () => {
        setOpenBookingDialog(false);
        setCurrentBooking(null);
        setTargetRoomId(null);
    };

    const handleDeleteBooking = (id) => {
        if (window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
            dispatch(deleteBooking(id));
        }
    };

    return {
        rooms, bookings, user, isAdmin, overallLoading,
        roomsError, bookingsError,

        openRoomDialog, currentRoom, initialRoomState,

        openBookingDialog, currentBooking, targetRoomId, initialBookingState,

        handleOpenCreateRoom, handleOpenEditRoom, handleCloseRoomDialog, handleDeleteRoom,
        handleOpenCreateBooking, handleOpenEditBooking, handleCloseBookingDialog, handleDeleteBooking,

        canManageBooking, canEditForParticipation,
    };
};