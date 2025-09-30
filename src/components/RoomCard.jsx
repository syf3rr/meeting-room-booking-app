import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function RoomCard({ room, bookings, user, overallLoading, isAdmin, formatDateTime, onEditRoom, onDeleteRoom, onOpenCreateBooking, onEditBooking, onDeleteBooking }) {
    const roomBookings = bookings.filter(b => b.roomId === room.id);
    const canManageBooking = () => {
        if (!user) return false;
        return user.role === 'Admin';
    };

    return (
        <Paper elevation={3} className="card p-7 flex flex-col h-full">
            <Box className="flex-grow">
                <Typography variant="h5" component="h2" className="text-blue-700 mb-4 font-semibold">
                    {room.name}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                    {room.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-6">
                    Місткість: {room.capacity}
                </Typography>

                <Typography variant="h6" className="text-gray-700 mt-6 mb-3 border-t pt-4">
                    Бронювання
                </Typography>

                <Box className="space-y-2">
                    {roomBookings.length > 0 ? (
                        roomBookings.map((booking) => {
                            const manageAllowed = canManageBooking();
                            const canEditForParticipation = !!user;

                            return (
                                <Paper key={booking.id} elevation={1} className="p-5 bg-gray-50">
                                    <Typography variant="subtitle1" className="font-medium text-sm">
                                        {booking.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="text-xs mt-1">
                                        {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="text-xs">
                                        Автор: {booking.userName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="text-xs mt-2">
                                        Учасники: {booking.participants && booking.participants.length > 0 ? booking.participants.join(', ') : 'Немає'}
                                    </Typography>

                                    <Box className="flex justify-end space-x-3 mt-3">
                                        <Button
                                            size="small"
                                            color="info"
                                            onClick={() => onEditBooking(booking)}
                                            disabled={overallLoading || !canEditForParticipation}
                                        >
                                            Ред.
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => onDeleteBooking(booking.id)}
                                            disabled={overallLoading || !manageAllowed}
                                        >
                                            Скасувати
                                        </Button>
                                    </Box>
                                </Paper>
                            );
                        })
                    ) : (
                        <Typography variant="body2" color="textSecondary" className="py-1">
                            Немає активних бронювань.
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onOpenCreateBooking(room.id)}
                    disabled={overallLoading || !user}
                >
                    Бронювати
                </Button>
                <Box className="flex space-x-2">
                    <Button
                        size="small"
                        color="info"
                        startIcon={<EditIcon />}
                        onClick={() => onEditRoom(room)}
                        disabled={overallLoading || !isAdmin}
                    >
                        Редагувати
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDeleteRoom(room.id)}
                        disabled={overallLoading || !isAdmin}
                    >
                        Видалити
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}


