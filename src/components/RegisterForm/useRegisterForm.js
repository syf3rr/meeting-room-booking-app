import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/auth/authSlice.js';

export const useRegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();
    const { loadingStatus, error } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loadingStatus === 'loading') return;

        if (password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        const role = isAdmin ? 'Admin' : 'User';

        dispatch(registerUser({ name, email, password, role }));
    };

    return {
        name, setName,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        isAdmin, setIsAdmin,

        loadingStatus,
        error,
        handleSubmit,
    };
};