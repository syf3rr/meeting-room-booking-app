import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/auth/authSlice.js';

export const useLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { loadingStatus, error } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loadingStatus !== 'loading') {
            console.log("Дані з форми:", { email, password });
            dispatch(loginUser({ email, password }));
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loadingStatus,
        error,
        handleSubmit,
    };
};