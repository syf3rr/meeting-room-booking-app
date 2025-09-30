import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../redux/rooms/roomsSlice';
import { fetchBookings, createBooking, updateBooking, deleteBooking } from '../redux/bookings/bookingsSlice';
import {
    Container, Typography, Button, Box, Paper, Grid, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const initialRoomState = { id: null, name: '', description: '', capacity: '' };
const initialBookingState = { id: null, roomId: null, title: '', description: '', startTime: '', endTime: '', userName: '' };

function BookingFormDialog({ open, handleClose, booking, roomId, userName }) {
    const dispatch = useDispatch();
    const isNew = !booking.id;
    const initialFormData = {
        roomId: booking.roomId || roomId,
        title: booking.title || '',
        description: booking.description || '',
        startTime: booking.startTime ? booking.startTime.substring(0, 16) : '',
        endTime: booking.endTime ? booking.endTime.substring(0, 16) : '',
        userName: booking.userName || userName
    };

    const [formData, setFormData] = useState(initialFormData);
    const { loadingStatus: bookingsLoading, error: bookingsError } = useSelector(state => state.bookings);

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
        }
    }, [booking, roomId, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (bookingsLoading === 'loading') return;

        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            alert("Помилка: Час завершення має бути пізніше часу початку.");
            return;
        }

        const bookingData = {
            ...formData,
            startTime: formData.startTime + ':00',
            endTime: formData.endTime + ':00',
        };

        if (isNew) {
            dispatch(createBooking(bookingData));
        } else {
            dispatch(updateBooking({ ...bookingData, id: booking.id }));
        }
    };

    useEffect(() => {
        if (bookingsLoading === 'succeeded' && !bookingsError) {
            if (open) {
                handleClose();
            }
        }
    }, [bookingsLoading, bookingsError]);


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Нове Бронювання' : 'Редагувати Бронювання'}</DialogTitle>
            <DialogContent dividers>
                {bookingsError && (
                    <Alert severity="error" className="mb-4">
                        {bookingsError}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Кімната ID"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={formData.roomId}
                        name="roomId"
                    />
                    <TextField
                        label="Назва/Тема зустрічі"
                        variant="outlined"
                        fullWidth
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Опис"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Початок"
                        variant="outlined"
                        fullWidth
                        required
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Кінець"
                        variant="outlined"
                        fullWidth
                        required
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Користувач"
                        variant="outlined"
                        fullWidth
                        disabled
                        name="userName"
                        value={formData.userName}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error" disabled={bookingsLoading === 'loading'}>
                    Скасувати
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={bookingsLoading === 'loading'}
                >
                    {bookingsLoading === 'loading' ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        isNew ? 'Створити' : 'Зберегти'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const RoomFormDialog = ({ open, handleClose, room }) => {
    const dispatch = useDispatch();
    const isNew = !room.id;
    const initialFormData = room.id ? room : initialRoomState;
    const [formData, setFormData] = useState(initialFormData);
    const { loadingStatus: roomLoading, error: roomError } = useSelector(state => state.rooms);

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
        }
    }, [room, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomLoading === 'loading') return;

        const roomData = {
            ...formData,
            capacity: Number(formData.capacity) || 0,
        };

        if (isNew) {
            dispatch(createRoom(roomData));
        } else {
            dispatch(updateRoom(roomData));
        }
    };

    useEffect(() => {
        if (roomLoading === 'succeeded' && open && !roomError) {
            handleClose();
        }
    }, [roomLoading, roomError]);


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Нову Кімнату' : 'Редагувати Кімнату'}</DialogTitle>
            <DialogContent dividers>
                {roomError && <Alert severity="error" className="mb-4">{roomError}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Назва Кімнати"
                        variant="outlined"
                        fullWidth
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Опис"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Місткість"
                        variant="outlined"
                        fullWidth
                        required
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error" disabled={roomLoading === 'loading'}>
                    Скасувати
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={roomLoading === 'loading'}
                >
                    {roomLoading === 'loading' ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        isNew ? 'Створити' : 'Зберегти'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default function MeetingRoomsDashboard() {
    const dispatch = useDispatch();
    const { rooms, loadingStatus: roomsLoading } = useSelector(state => state.rooms);
    const { bookings, loadingStatus: bookingsLoading, error: bookingsError } = useSelector(state => state.bookings);
    const { user } = useSelector(state => state.auth);

    // Стан для діалогу кімнат
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(initialRoomState);

    // Стан для діалогу бронювань
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(initialBookingState);
    const [targetRoomId, setTargetRoomId] = useState(null);

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchBookings());
    }, [dispatch]);

    const handleOpenCreateRoom = () => {
        setCurrentRoom(initialRoomState);
        setOpenRoomDialog(true);
    };

    const handleOpenEditRoom = (room) => {
        setCurrentRoom(room);
        setOpenRoomDialog(true);
    };

    const handleDeleteRoom = (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю кімнату та всі її бронювання?')) {
            dispatch(deleteRoom(id));
        }
    };

    const handleCloseRoomDialog = () => {
        setOpenRoomDialog(false);
        setCurrentRoom(initialRoomState);
    };


    const handleOpenCreateBooking = (roomId) => {
        setCurrentBooking(initialBookingState);
        setTargetRoomId(roomId);
        setOpenBookingDialog(true);
    };

    const handleOpenEditBooking = (booking) => {
        setCurrentBooking(booking);
        setTargetRoomId(booking.roomId);
        setOpenBookingDialog(true);
    };

    const handleDeleteBooking = (id) => {
        if (window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
            dispatch(deleteBooking(id));
        }
    };

    const handleCloseBookingDialog = () => {
        setOpenBookingDialog(false);
        setCurrentBooking(initialBookingState);
        setTargetRoomId(null);
    };


    const overallLoading = roomsLoading === 'loading' || bookingsLoading === 'loading';

    const bookingsByRoom = rooms.reduce((acc, room) => {
        acc[room.id] = bookings.filter(b => b.roomId === room.id);
        return acc;
    }, {});


    return (
        <Container maxWidth="lg" className="py-8">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h4" component="h1" className="text-gray-800">
                    Панель Керування Кімнатами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateRoom}
                    disabled={overallLoading}
                >
                    Додати Кімнату
                </Button>
            </Box>

            {overallLoading && <Alert severity="info" className="mb-4">Завантаження даних...</Alert>}
            {bookingsError && <Alert severity="error" className="mb-4">Помилка бронювання: {bookingsError}</Alert>}

            <Grid container spacing={4}>
                {rooms.map((room) => {
                    const roomBookings = bookingsByRoom[room.id] || [];

                    return (
                        <Grid xs={12} sm={6} md={4} key={room.id}>
                            <Paper elevation={3} className="p-4 flex flex-col h-full">
                                <Typography variant="h5" component="h2" className="text-blue-600 mb-2">
                                    {room.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="mb-2">
                                    {room.description}
                                </Typography>
                                <Typography variant="body1" className="mb-4 font-semibold">
                                    Місткість: {room.capacity} місць
                                </Typography>

                                <Box className="flex justify-between items-center mb-4">
                                    <Typography variant="subtitle1" className="text-gray-700 font-bold">
                                        Бронювання:
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenCreateBooking(room.id)}
                                        disabled={overallLoading}
                                    >
                                        Забронювати
                                    </Button>
                                </Box>

                                <Box className="flex-grow space-y-3 mb-4">
                                    {roomBookings.length > 0 ? (
                                        roomBookings
                                            .filter(b => new Date(b.endTime) > new Date()) // Показуємо лише майбутні
                                            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) // Сортуємо за часом
                                            .slice(0, 3) // Показуємо лише 3 найближчі
                                            .map((booking) => (
                                                <Paper key={booking.id} elevation={1} className="p-3 bg-gray-50">
                                                    <Typography variant="body2" className="font-semibold text-gray-800">
                                                        {booking.title}
                                                    </Typography>
                                                    <Typography className="text-xs text-gray-500 my-1">
                                                        {formatDateTime(booking.startTime)}
                                                    </Typography>
                                                    <Box className="flex justify-end space-x-2 mt-2">
                                                        <Button
                                                            size="small"
                                                            color="info"
                                                            onClick={() => handleOpenEditBooking(booking)}
                                                            disabled={overallLoading}
                                                        >
                                                            Ред.
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteBooking(booking.id)}
                                                            disabled={overallLoading}
                                                        >
                                                            Скасувати
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            Наразі майбутніх бронювань немає.
                                        </Typography>
                                    )}
                                    {roomBookings.length > 3 && (
                                        <Typography variant="body2" color="primary" className="text-right">
                                            та ще {roomBookings.length - 3}...
                                        </Typography>
                                    )}
                                </Box>

                                <Box className="flex justify-between mt-auto pt-4 border-t border-gray-200">
                                    <Button
                                        size="small"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleOpenEditRoom(room)}
                                        disabled={overallLoading}
                                    >
                                        Редагувати
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteRoom(room.id)}
                                        disabled={overallLoading}
                                    >
                                        Видалити
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <RoomFormDialog
                open={openRoomDialog}
                handleClose={handleCloseRoomDialog}
                room={currentRoom || initialRoomState}
            />

            <BookingFormDialog
                open={openBookingDialog}
                handleClose={handleCloseBookingDialog}
                booking={currentBooking || initialBookingState}
                roomId={targetRoomId}
                userName={user?.name || 'Unknown User'}
            />
        </Container>
    );
}