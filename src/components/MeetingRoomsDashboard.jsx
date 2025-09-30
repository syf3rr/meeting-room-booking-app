import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRooms } from '../hooks/useRooms.js';
import { useBookings } from '../hooks/useBookings.js';
import { useDateUtils } from '../hooks/useDateUtils.js';
import BookingFormDialog from './BookingFormDialog.jsx';
import RoomFormDialog from './RoomFormDialog.jsx';
import RoomCard from './RoomCard.jsx';
import {
    Container, Typography, Button, Box, Paper, Grid, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const useFormat = () => {
    const { formatDateTime } = useDateUtils();
    return (isoString) => formatDateTime(isoString);
};

const initialRoomState = { id: null, name: '', description: '', capacity: '' };
const initialBookingState = { id: null, roomId: null, title: '', description: '', startTime: '', endTime: '', userName: '', participants: [] };

export default function MeetingRoomsDashboard() {
    const dispatch = useDispatch();
    const { rooms, loadingStatus: roomsLoadingStatus, error: roomsError, loadRooms, deleteRoom } = useRooms();
    const { bookings, loadingStatus: bookingsLoadingStatus, error: bookingsError, loadBookings, deleteBooking, user } = useBookings();
    const formatDateTime = useFormat();
    const { loadingStatus: authLoadingStatus } = useSelector(state => state.auth);
    const isAdmin = user?.role === 'Admin';

    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [targetRoomId, setTargetRoomId] = useState(null);

    const canManageBooking = (booking) => {
        if (!user) return false;
        return user.role === 'Admin';
    };

    useEffect(() => {
        loadRooms();
        loadBookings();
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
            deleteRoom(id);
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
            deleteBooking(id);
        }
    };

    const overallLoading = roomsLoadingStatus === 'loading' || bookingsLoadingStatus === 'loading' || authLoadingStatus === 'loading';

    return (
        <Container component="main" maxWidth="xl" className="mt-14 p-8">
            <Box className="flex justify-between items-center mb-10">
                <Typography variant="h4" component="h1" className="text-gray-800 font-semibold">
                    Панель Керування Кімнатами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    className="btn-primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateRoom}
                    disabled={overallLoading || !isAdmin}
                >
                    Додати Кімнату
                </Button>
            </Box>

            {(roomsError || bookingsError) && <Alert severity="error" className="mb-8">Помилка: {roomsError || bookingsError}</Alert>}

            {overallLoading && (
                <Box className="flex justify-center items-center py-12">
                    <CircularProgress />
                    <Typography variant="h6" className="ml-4">Завантаження даних...</Typography>
                </Box>
            )}

            <Grid container spacing={5}>
                {rooms.map((room) => {
                    const roomBookings = bookings.filter(b => b.roomId === room.id);
                    return (
                        <Grid item key={room.id} xs={12} md={6} lg={4} className="transition-transform hover:-translate-y-1">
                            <RoomCard
                                room={room}
                                bookings={bookings}
                                user={user}
                                overallLoading={overallLoading}
                                isAdmin={isAdmin}
                                formatDateTime={formatDateTime}
                                onEditRoom={handleOpenEditRoom}
                                onDeleteRoom={handleDeleteRoom}
                                onOpenCreateBooking={handleOpenCreateBooking}
                                onEditBooking={handleOpenEditBooking}
                                onDeleteBooking={handleDeleteBooking}
                            />
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