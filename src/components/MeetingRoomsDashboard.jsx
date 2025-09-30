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
const initialBookingState = { id: null, roomId: null, title: '', description: '', startTime: '', endTime: '', userName: '', participants: [] };

function BookingFormDialog({ open, handleClose, booking, roomId, userName }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const isAdmin = user?.role === 'Admin';
    const isNew = !booking.id;

    const initialFormData = {
        roomId: booking.roomId || roomId,
        title: booking.title || '',
        description: booking.description || '',
        startTime: booking.startTime ? booking.startTime.substring(0, 16) : '',
        endTime: booking.endTime ? booking.endTime.substring(0, 16) : '',
        userName: booking.userName || userName,
        participants: (booking.participants || []).join(', ')
    };

    const [formData, setFormData] = useState(initialFormData);
    const { loadingStatus: bookingsLoadingStatus, error: bookingsError } = useSelector(state => state.bookings);
    const loading = bookingsLoadingStatus === 'loading';

    useEffect(() => {
        setFormData(initialFormData);
    }, [booking, open, roomId, userName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        if (isNew || isAdmin) {
            if (new Date(formData.startTime) >= new Date(formData.endTime)) {
                alert('Час початку має бути раніше часу закінчення.');
                return;
            }
        }

        const participantsArray = formData.participants
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '');

        const bookingData = {
            ...formData,
            startTime: formData.startTime + ':00',
            endTime: formData.endTime + ':00',
            participants: participantsArray,
        };

        if (isNew) {
            dispatch(createBooking(bookingData));
        } else {
            dispatch(updateBooking({ ...bookingData, id: booking.id }));
        }

        handleClose();
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Бронювання' : 'Редагувати Бронювання'}</DialogTitle>
            <DialogContent dividers>
                {bookingsError && <Alert severity="error" className="mb-4">{bookingsError}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Назва Зустрічі"
                        variant="outlined"
                        fullWidth
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={loading || (!isNew && !isAdmin)}
                    />
                    <TextField
                        label="Опис"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading || (!isNew && !isAdmin)}
                    />
                    <TextField
                        label="Початок"
                        type="datetime-local"
                        fullWidth
                        required
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        disabled={loading || (!isNew && !isAdmin)}
                    />
                    <TextField
                        label="Закінчення"
                        type="datetime-local"
                        fullWidth
                        required
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        disabled={loading || (!isNew && !isAdmin)}
                    />
                    <TextField
                        label="Користувач (Автор)"
                        variant="outlined"
                        fullWidth
                        required
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        disabled
                    />
                    <TextField
                        label="Учасники (email через кому)"
                        variant="outlined"
                        fullWidth
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        helperText="Введіть email'и учасників через кому (наприклад: user@app.com, another@user.com). Натисніть 'Зберегти', щоб долучитися."
                        disabled={loading || !user}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                    Скасувати
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading || (!isNew && !user)}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isNew ? 'Створити' : 'Зберегти'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function RoomFormDialog({ open, handleClose, room }) {
    const dispatch = useDispatch();
    const isNew = !room.id;
    const initialFormData = {
        name: room.name || '',
        description: room.description || '',
        capacity: room.capacity || '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const { loadingStatus: roomsLoadingStatus, error: roomsError } = useSelector(state => state.rooms);
    const loading = roomsLoadingStatus === 'loading';

    useEffect(() => {
        setFormData(initialFormData);
    }, [room, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        if (isNew) {
            dispatch(createRoom(formData));
        } else {
            dispatch(updateRoom({ ...formData, id: room.id }));
        }

        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Кімнату' : 'Редагувати Кімнату'}</DialogTitle>
            <DialogContent dividers>
                {roomsError && <Alert severity="error" className="mb-4">{roomsError}</Alert>}
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
                        rows={2}
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
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                    Скасувати
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isNew ? 'Створити' : 'Зберегти'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function MeetingRoomsDashboard() {
    const dispatch = useDispatch();
    const { rooms, loadingStatus: roomsLoadingStatus, error: roomsError } = useSelector(state => state.rooms);
    const { bookings, loadingStatus: bookingsLoadingStatus, error: bookingsError } = useSelector(state => state.bookings);
    const { user, loadingStatus: authLoadingStatus } = useSelector(state => state.auth);
    const isAdmin = user?.role === 'Admin';

    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [targetRoomId, setTargetRoomId] = useState(null);

    const canManageBooking = (booking) => {
        if (!user) return false;
        if (isAdmin) return true;
        return false;
    };

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchBookings());
    }, [dispatch]);

    // Room handlers
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

    const overallLoading = roomsLoadingStatus === 'loading' || bookingsLoadingStatus === 'loading' || authLoadingStatus === 'loading';

    return (
        <Container component="main" maxWidth="xl" className="mt-10 p-6">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h4" component="h1" className="text-gray-800">
                    Панель Керування Кімнатами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateRoom}
                    disabled={overallLoading || !isAdmin}
                >
                    Додати Кімнату
                </Button>
            </Box>

            {(roomsError || bookingsError) && <Alert severity="error" className="mb-6">Помилка: {roomsError || bookingsError}</Alert>}

            {overallLoading && (
                <Box className="flex justify-center items-center py-10">
                    <CircularProgress />
                    <Typography variant="h6" className="ml-3">Завантаження даних...</Typography>
                </Box>
            )}

            <Grid container spacing={4}>
                {rooms.map((room) => {
                    const roomBookings = bookings.filter(b => b.roomId === room.id);
                    return (
                        <Grid item key={room.id} xs={12} md={6} lg={4}>
                            <Paper elevation={3} className="p-4 flex flex-col h-full">
                                <Box className="flex-grow">
                                    <Typography variant="h5" component="h2" className="text-blue-700 mb-2 font-semibold">
                                        {room.name}
                                    </Typography>
                                    <Typography variant="body1" className="text-gray-600 mb-2">
                                        {room.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="mb-4">
                                        Місткість: {room.capacity}
                                    </Typography>

                                    <Typography variant="h6" className="text-gray-700 mt-4 mb-2 border-t pt-2">
                                        Бронювання
                                    </Typography>

                                    <Box className="space-y-2">
                                        {roomBookings.length > 0 ? (
                                            roomBookings.map((booking) => {
                                                const manageAllowed = canManageBooking(booking);
                                                const canEditForParticipation = !!user;

                                                return (
                                                    <Paper key={booking.id} elevation={1} className="p-3 bg-gray-50">
                                                        <Typography variant="subtitle1" className="font-medium text-sm">
                                                            {booking.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" className="text-xs">
                                                            {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" className="text-xs">
                                                            Автор: {booking.userName}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" className="text-xs mt-1">
                                                            Учасники: {booking.participants && booking.participants.length > 0 ? booking.participants.join(', ') : 'Немає'}
                                                        </Typography>

                                                        <Box className="flex justify-end space-x-2 mt-2">
                                                            <Button
                                                                size="small"
                                                                color="info"
                                                                onClick={() => handleOpenEditBooking(booking)}
                                                                disabled={overallLoading || !canEditForParticipation}
                                                            >
                                                                Ред.
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeleteBooking(booking.id)}
                                                                disabled={overallLoading || !manageAllowed}
                                                            >
                                                                Скасувати
                                                            </Button>
                                                        </Box>
                                                    </Paper>
                                                );
                                            })
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Немає активних бронювань.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenCreateBooking(room.id)}
                                        disabled={overallLoading || !user}
                                    >
                                        Бронювати
                                    </Button>
                                    <Box className="flex space-x-2">
                                        <Button
                                            size="small"
                                            color="info"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleOpenEditRoom(room)}
                                            disabled={overallLoading || !isAdmin}
                                        >
                                            Редагувати
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteRoom(room.id)}
                                            disabled={overallLoading || !isAdmin}
                                        >
                                            Видалити
                                        </Button>
                                    </Box>
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