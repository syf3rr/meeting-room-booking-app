import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useAuth } from '../hooks/useAuth.js';
import { TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loadingStatus, error, login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <Container component="main" maxWidth="xs" className="mt-16 p-9 bg-white shadow-xl rounded-xl">
            <div className="flex flex-col items-center text-center">
                <Typography component="h1" variant="h5" className="mb-7 text-gray-800">
                    Вхід у систему
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-9">
                    Тестовий вхід
                </Typography>

                {error && <Alert severity="error" className="w-full mb-7">{error}</Alert>}

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
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
                        className="mb-6"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="h-12 text-lg font-bold mt-2"
                        disabled={loadingStatus === 'loading'}
                    >
                        {loadingStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
                    </Button>
                </form>
            </div>
        </Container>
    );
}