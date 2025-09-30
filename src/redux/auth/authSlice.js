import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//jwt
const MOCK_TOKEN = "mocked-jwt-token-12345-for-auth";

const mockLogin = async ({ email, password }) => {
    //запит
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Отримані дані:", { email, password });
    console.log("Очікувані дані:", { email: "test@app.com", password: "123456" });

    //перевірка даних
    if (email === "test@app.com" && password === "123456") {
        //якщо відповідь успішна
        return {
            token: MOCK_TOKEN,
            user: {
                name: 'Тестовий Користувач',
                email,
                role: 'Employee'
            }
        }
        //якщо відповідь провальна
    } else {
        throw new Error("Невірний email або пароль.");
    }
};

const mockRegister = async (userData) => {
    //перевірка на унікальність
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (userData.email === "test@app.com") {
        throw new Error("Користувач з таким email вже існує.");
    }

    //успішна реєстрація
    return {
        message: "Користувач успішно зареєстрований!",
        //віддаємо токен зразу для зручності
        token: MOCK_TOKEN + "-new",
        user: {
            name: userData.name,
            email: userData.email,
            role: 'Employee'
        }
    };
};

export const loginUser = createAsyncThunk(
    'auth/login',
    mockLogin
);

export const registerUser = createAsyncThunk(
    'auth/register',
    mockRegister
);

const initialState = {
    token: localStorage.getItem('authToken') || null,
    user: null,
    isLoggedIn: !!localStorage.getItem('authToken'),
    loadingStatus: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('authToken');
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
            state.loadingStatus = 'idle';
            state.error = null;
        },
        //відновлення стану після перезагрузки
        setAuthFromStorage: (state, action) => {
            state.token = action.payload.token;
            state.user = { name: 'Тестовий користувач', email: 'test@app.com', role: 'Employee' };
            state.isLoggedIn = true;
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
                localStorage.setItem('authToken', action.payload.token); // Одразу входимо
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