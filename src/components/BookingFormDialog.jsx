import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBookings } from '../hooks/useBookings.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, CircularProgress } from '@mui/material';

export default function BookingFormDialog({ open, handleClose, booking, roomId, userName }) {
    const { validateTimes, parseParticipants, createBooking, updateBooking, loadingStatus: bookingsLoadingStatus, error: bookingsError } = useBookings();
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
    const loading = bookingsLoadingStatus === 'loading';

    useEffect(() => {
        setFormData(initialFormData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [booking, open, roomId, userName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        if (isNew || isAdmin) {
            const valid = validateTimes(formData.startTime, formData.endTime);
            if (!valid) return;
        }

        const participantsArray = parseParticipants(formData.participants);

        const bookingData = {
            ...formData,
            startTime: formData.startTime.endsWith(':00') ? formData.startTime : `${formData.startTime}:00`,
            endTime: formData.endTime.endsWith(':00') ? formData.endTime : `${formData.endTime}:00`,
            participants: participantsArray,
        };

        if (isNew) {
            createBooking(bookingData);
        } else {
            updateBooking({ ...bookingData, id: booking.id });
        }

        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Бронювання' : 'Редагувати Бронювання'}</DialogTitle>
            <DialogContent dividers className="pt-6">
                {bookingsError && <Alert severity="error" className="mb-6">{bookingsError}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-6">
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


