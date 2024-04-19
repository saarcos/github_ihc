import { createContext, useContext, useState } from 'react';
import React from 'react';

export enum Role {
	ADMIN = 'admin',
	USER = 'user'
}

interface AuthProps {
	authState: { authenticated: boolean | null; email: string | null; role: Role | null };
	onLogin: (email: string, password: string) => void;
	onLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
	const [authState, setAuthState] = useState<{
		authenticated: boolean | null;
		email: string | null;
		role: Role | null;
	}>({
		authenticated: null,
		email: null,
		role: null
	});

	const login = (email: string, password: string) => {
		if (email === 'admin' && password === 'admin') {
			setAuthState({
				authenticated: true,
				email: email,
				role: Role.ADMIN
			});
		} else if (email === 'user' && password === 'user') {
			setAuthState({
				authenticated: true,
				email: email,
				role: Role.USER
			});
		} else {
			alert('Invalid email or password!');
		}
	};

	const logout = async () => {
		setAuthState({
			authenticated: false,
			email: null,
			role: null
		});
	};

	const value = {
		onLogin: login,
		onLogout: logout,
		authState
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};