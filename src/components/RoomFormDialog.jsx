import React, { useState, useEffect } from 'react';
import { useRooms } from '../hooks/useRooms.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, CircularProgress } from '@mui/material';

export default function RoomFormDialog({ open, handleClose, room }) {
    const { createRoom, updateRoom, loadingStatus: roomsLoadingStatus, error: roomsError } = useRooms();
    const isNew = !room.id;
    const initialFormData = {
        name: room.name || '',
        description: room.description || '',
        capacity: room.capacity || '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const loading = roomsLoadingStatus === 'loading';

    useEffect(() => {
        setFormData(initialFormData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        if (isNew) {
            createRoom(formData);
        } else {
            updateRoom({ ...formData, id: room.id });
        }

        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isNew ? 'Створити Кімнату' : 'Редагувати Кімнату'}</DialogTitle>
            <DialogContent dividers className="pt-6">
                {roomsError && <Alert severity="error" className="mb-6">{roomsError}</Alert>}
                <form onSubmit={handleSubmit} className="space-y-6">
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


