import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth.js';
import {
    TextField, Button, Typography, Container, Alert, CircularProgress,
    FormControlLabel, Checkbox, Box
} from '@mui/material';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { loadingStatus, error, register } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const role = isAdmin ? 'Admin' : 'User';
        register({ name, email, password, confirmPassword, role });
    };

    return (
        <Container component="main" maxWidth="xs" className="mt-16 p-9 bg-white shadow-xl rounded-xl">
            <div className="flex flex-col items-center text-center">
                <Typography component="h1" variant="h5" className="mb-9 text-gray-800">
                    Реєстрація Користувача
                </Typography>

                {error && <Alert severity="error" className="w-full mb-7">{error}</Alert>}

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <TextField
                        label="Ваше Ім'я"
                        variant="outlined"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        className="mb-4"
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        margin="normal"
                        className="mb-4"
                    />
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        margin="normal"
                        className="mb-4"
                    />
                    <TextField
                        label="Підтвердіть Пароль"
                        variant="outlined"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        margin="normal"
                        className="mb-6"
                    />

                    <Box className="flex justify-start w-full mt-2 mb-4">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Зареєструвати як Адміністратора"
                        />
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className="h-12 text-lg font-bold"
                        disabled={loadingStatus === 'loading'}
                    >
                        {loadingStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Зареєструватися'}
                    </Button>
                </form>
            </div>
        </Container>
    );
}