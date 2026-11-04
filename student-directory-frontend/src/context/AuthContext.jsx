
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    // Get saved JWT
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    // Get saved user
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });

    const isAuthenticated = Boolean(token);

    // REGISTER
    async function register(name, email, password) {
        const response = await fetch(
            'http://localhost:3000/api/auth/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || data.message || 'Registration failed.'
            );
        }

        return data;
    }

    // LOGIN
    async function login(email, password) {
        const response = await fetch(
            'http://localhost:3000/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || data.message || 'Invalid credentials.'
            );
        }

        if (!data.token) {
            throw new Error('No token received from server.');
        }

        // Save token
        setToken(data.token);
        localStorage.setItem('token', data.token);

        // Save user information
        setUser(data.user || null);

        if (data.user) {
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );
        }

        return data;
    }

    // LOGOUT
    function logout() {
        setToken(null);
        setUser(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                register,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
