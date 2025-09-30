import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createRoom, updateRoom, deleteRoom } from '../redux/rooms/roomsSlice';
import {
    Container, Typography, Button, Box, Paper, Grid, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const initialFormState = { id: null, name: '', description: '', capacity: '' };

const RoomFormDialog = ({ open, handleClose, room = initialFormState }) => {
    const dispatch = useDispatch();
    const { loadingStatus, error } = useSelector(state => state.rooms);
    const [formData, setFormData] = useState(room);
    const isEditMode = !!room.id;

    React.useEffect(() => {
        setFormData(room);
    }, [room, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loadingStatus === 'loading') return;

        const action = isEditMode ? updateRoom : createRoom;
        dispatch(action(formData))
            .unwrap()
            .then(() => handleClose())
            .catch(() => { /* помилка обробляється в slice */ });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Редагувати Кімнату' : 'Створити Нову Кімнату'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    <Box className="space-y-4">
                        <TextField
                            label="Назва Кімнати"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Опис"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            label="Місткість (кількість осіб)"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            fullWidth
                            type="number"
                            inputProps={{ min: 1 }}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error" disabled={loadingStatus === 'loading'}>
                        СкасуватиВ
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loadingStatus === 'loading'}>
                        {loadingStatus === 'loading' ? <CircularProgress size={24} /> : (isEditMode ? 'Зберегти' : 'Створити')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default function MeetingRoomsDashboard() {
    const dispatch = useDispatch();
    const { rooms, loadingStatus, error } = useSelector(state => state.rooms);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null); //для редпгування

    const handleOpenCreate = () => {
        setCurrentRoom(initialFormState); //встановлення початкового стану для створення
        setOpenDialog(true);
    };

    const handleOpenEdit = (room) => {
        setCurrentRoom(room);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю кімнату?')) {
            dispatch(deleteRoom(id));
        }
    };

    return (
        <Container maxWidth="lg" className="py-8">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" className="text-blue-700">
                    Керування Переговорними Кімнатами
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    disabled={loadingStatus === 'loading'}
                >
                    Створити Кімнату
                </Button>
            </Box>

            {loadingStatus === 'loading' && <Alert severity="info" className="mb-4">Завантаження...</Alert>}
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}

            <Grid container spacing={3}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Paper elevation={3} className="p-4 h-full flex flex-col justify-between">
                            <Box>
                                <Typography variant="h6" className="font-bold text-gray-800">{room.name}</Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-1">
                                    {room.description}
                                </Typography>
                                <Typography variant="body1" className="mt-2 text-green-600">
                                    Місткість: **{room.capacity}** осіб
                                </Typography>
                            </Box>
                            <Box className="flex justify-end space-x-2 mt-4">
                                <Button
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleOpenEdit(room)}
                                    disabled={loadingStatus === 'loading'}
                                >
                                    Редагувати
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(room.id)}
                                    disabled={loadingStatus === 'loading'}
                                >
                                    Видалити
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <RoomFormDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                room={currentRoom || initialFormState}
            />
        </Container>
    );
}