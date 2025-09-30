import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/auth/authSlice';
import { TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const { loadingStatus, error } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loadingStatus === 'loading') return;

        if (password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        dispatch(registerUser({ name, email, password }));
    };

    return (
        <Container component="main" maxWidth="xs" className="mt-10 p-6 bg-white shadow-xl rounded-lg">
            <div className="flex flex-col items-center">
                <Typography component="h1" variant="h5" className="mb-6 text-gray-800">
                    Реєстрація Користувача
                </Typography>

                {error && <Alert severity="error" className="w-full mb-4">{error}</Alert>}

                <form className="w-full space-y-4" onSubmit={handleSubmit}>
                    <TextField
                        label="Ім'я"
                        variant="outlined"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    <TextField
                        label="Підтвердіть Пароль"
                        variant="outlined"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                    />
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