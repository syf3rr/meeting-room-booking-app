import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../redux/auth/authSlice.js';

export function useAuth() {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    const login = ({ email, password }) => {
        if (authState.loadingStatus === 'loading') return;
        dispatch(authActions.loginUser({ email, password }));
    };

    const register = ({ name, email, password, confirmPassword, role }) => {
        if (authState.loadingStatus === 'loading') return;
        if (password !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }
        dispatch(authActions.registerUser({ name, email, password, role }));
    };

    return {
        ...authState,
        login,
        register,
    };
}


