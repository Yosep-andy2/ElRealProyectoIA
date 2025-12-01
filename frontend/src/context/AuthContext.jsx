import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Check if user is logged in on mount
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/v1/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await axios.post('http://localhost:8000/api/v1/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const { access_token } = response.data;

            setToken(access_token);
            addToast('Inicio de sesión exitoso', 'success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.detail || 'Error al iniciar sesión';
            addToast(message, 'error');
            return false;
        }
    };

    const register = async (email, password) => {
        try {
            await axios.post('http://localhost:8000/api/v1/auth/register', {
                email,
                password,
                is_superuser: false
            });
            addToast('Registro exitoso. Por favor inicia sesión.', 'success');
            return true;
        } catch (error) {
            console.error('Register error:', error);
            const message = error.response?.data?.detail || 'Error al registrarse';
            addToast(message, 'error');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        addToast('Sesión cerrada', 'info');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
