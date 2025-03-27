import React, { createContext, useState } from "react";
import { User } from "../types/user.tsx";

interface AuthContextType {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const AuthContext = createContext<AuthContextType>(
	{} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User>({
		username: "no user",
		phone: "-",
		email: "-",
	} as User);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};