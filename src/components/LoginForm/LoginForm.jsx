import React from 'react';
import { TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useLoginForm } from './useLoginForm';

export default function LoginForm() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loadingStatus,
        error,
        handleSubmit
    } = useLoginForm();

    return (
        <Container component="main" maxWidth="xs" className="mt-10 p-6 bg-white shadow-xl rounded-lg">
            <div className="flex flex-col items-center">
                <Typography component="h1" variant="h5" className="mb-4 text-gray-800">
                    Вхід у систему
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-6">
                    Тестовий вхід
                </Typography>

                {error && <Alert severity="error" className="w-full mb-4">{error}</Alert>}

                <form className="w-full space-y-4" onSubmit={handleSubmit}>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="h-12 text-lg font-bold"
                        disabled={loadingStatus === 'loading'}
                    >
                        {loadingStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
                    </Button>
                </form>
            </div>
        </Container>
    );
}