import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const USERS_STORAGE_KEY = 'meeting_app_users';

const MOCK_ADMIN_USER = { name: 'Адміністратор', email: 'admin@app.com', password: '123456', role: 'Admin' };
const MOCK_DEFAULT_USER = { name: 'Звичайний Користувач', email: 'user@app.com', password: '123456', role: 'User' };

const loadUsers = () => {
    try {
        const serializedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (serializedUsers === null) {
            return [MOCK_ADMIN_USER, MOCK_DEFAULT_USER];
        }
        return JSON.parse(serializedUsers);
    } catch (e) {
        console.warn("Could not load users from localStorage:", e);
        return [MOCK_ADMIN_USER, MOCK_DEFAULT_USER];
    }
};

const saveUsers = (users) => {
    try {
        const serializedUsers = JSON.stringify(users);
        localStorage.setItem(USERS_STORAGE_KEY, serializedUsers);
    } catch (e) {
        console.error("Could not save users to localStorage:", e);
    }
};

const mockLogin = async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = loadUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
        const token = `mocked-jwt-${foundUser.email}`;
        const { password: _, ...userWithoutPassword } = foundUser;
        return { token, user: userWithoutPassword };
    }

    throw new Error("Невірний email або пароль.");
};

const mockRegister = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const users = loadUsers();

    if (users.some(u => u.email === userData.email)) {
        throw new Error("Користувач з цим email вже існує. Спробуйте інший email.");
    }

    const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'User'
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
        token: `mocked-jwt-${newUser.email}`,
        user: userWithoutPassword
    };
};

export const loginUser = createAsyncThunk('auth/loginUser', mockLogin);
export const registerUser = createAsyncThunk('auth/registerUser', mockRegister);

const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
    loadingStatus: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('authToken');
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.loadingStatus = 'idle';
            state.error = null;
        },
        setAuthFromStorage: (state) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                state.token = token;
                state.isLoggedIn = true;

                const users = loadUsers();
                const userEmail = token.replace('mocked-jwt-', '');
                const foundUser = users.find(u => u.email === userEmail);

                if (foundUser) {
                    const { password: _, ...userWithoutPassword } = foundUser;
                    state.user = userWithoutPassword;
                } else {
                    state.user = { name: 'Невідомий', email: userEmail, role: 'User' };
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loadingStatus = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                localStorage.setItem('authToken', action.payload.token);
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.loadingStatus = 'idle';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loadingStatus = 'failed';
                state.error = action.error.message || 'Помилка входу.';
            })
            .addCase(registerUser.pending, (state) => {
                state.loadingStatus = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                localStorage.setItem('authToken', action.payload.token);
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.loadingStatus = 'idle';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loadingStatus = 'failed';
                state.error = action.error.message || 'Помилка реєстрації.';
            });
    },
});

export const { logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;