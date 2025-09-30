import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setAuthFromStorage } from './redux/auth/authSlice';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import RegisterForm from './components/RegisterForm/RegisterForm.jsx';
import MeetingRoomsDashboard from './components/MeetingRoomsDashboard/MeetingRoomsDashboard.jsx';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useSelector(state => state.auth);
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const BookingDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    return (
        <div className="p-8 text-center">
            <Typography variant="h4" gutterBottom className="text-green-600">
                Вітаємо, {user?.name || 'Користувачу'}!
            </Typography>
            <Typography variant="h6" className="text-gray-700 mb-6">
                Ви успішно авторизовані. Доступ до системи бронювання відкрито.
            </Typography>

            <Box className="flex justify-center space-x-4">
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/rooms"
                    className="mt-4"
                >
                    Керування Кімнатами
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => dispatch(logout())}
                    className="mt-4"
                >
                    Вийти
                </Button>
            </Box>
        </div>
    );
};


export default function App() {
    const { isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            dispatch(setAuthFromStorage({ token }));
        }
    }, [dispatch]);


    return (
        <Router>
            <AppBar position="static" className="bg-blue-600">
                <Toolbar>
                    <Typography variant="h6" className="flex-grow">
                        Meeting Room Booking App
                    </Typography>
                    <Box className="space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Button color="inherit" href="/login">Вхід</Button>
                                <Button color="inherit" href="/register">Реєстрація</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/dashboard">Дашборд</Button>
                                <Button color="inherit" component={Link} to="/rooms">Кімнати</Button>
                                <Button color="inherit" onClick={() => dispatch(logout())}>Вихід</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
                    <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterForm />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <BookingDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/rooms"
                        element={
                            <ProtectedRoute>
                                <MeetingRoomsDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />

                </Routes>
            </div>
        </Router>
    );
}