import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type User = { id: string; email: string; name: string; avatarUrl?: string } | null;

type AuthContextType = {
	user: User;
	token: string | null;
	login: (token: string, user: NonNullable<User>) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
	const [user, setUser] = useState<User>(null);

	useEffect(() => {
		if (!token) return setUser(null);
		try {
			const decoded: any = jwtDecode(token);
			if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
				setToken(null);
				localStorage.removeItem('token');
				setUser(null);
				return;
			}
			// Optimistically keep user from localStorage if present
			const saved = localStorage.getItem('user');
			if (saved) setUser(JSON.parse(saved));
		} catch {
			setUser(null);
		}
	}, [token]);

	const value = useMemo<AuthContextType>(() => ({
		user,
		token,
		login: (t, u) => {
			setToken(t);
			localStorage.setItem('token', t);
			setUser(u);
			localStorage.setItem('user', JSON.stringify(u));
		},
		logout: () => {
			setToken(null);
			localStorage.removeItem('token');
			setUser(null);
			localStorage.removeItem('user');
		},
	}), [user, token]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}

