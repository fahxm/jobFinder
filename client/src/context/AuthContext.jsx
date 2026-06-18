import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('jobFinderUser');
        const token = localStorage.getItem('jobFinderToken');
        if (savedUser && token) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setUserProfile(user); 
        }
        setLoading(false);
    }, []);

    const signup = async (name, email, password) => {
        const response = await fetch('https://jobfinder-8yu2.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            setCurrentUser(data.user);
            setUserProfile(data.user);
            localStorage.setItem('jobFinderUser', JSON.stringify(data.user));
            localStorage.setItem('jobFinderToken', data.token);
            return { success: true };
        } else {
            return { success: false, message: data.message || (data.errors ? data.errors[0].msg : 'Signup failed') };
        }
    };

    const login = async (email, password) => {
        const response = await fetch('https://jobfinder-8yu2.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            setCurrentUser(data.user);
            setUserProfile(data.user);
            localStorage.setItem('jobFinderUser', JSON.stringify(data.user));
            localStorage.setItem('jobFinderToken', data.token);
            return { success: true };
        } else {
            return { success: false, message: data.message || (data.errors ? data.errors[0].msg : 'Login failed') };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('jobFinderUser');
        localStorage.removeItem('jobFinderToken');
    };

    const refreshProfile = async (updatedData) => {
        if (updatedData) {
            setUserProfile(updatedData);
            localStorage.setItem('jobFinderUser', JSON.stringify(updatedData));
        }
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
