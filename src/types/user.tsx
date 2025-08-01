interface User {
	username: string;
	phone: string;
	email: string;
}

interface LoginFormData {
  identifier: string;
  password: string;
}

interface RegisterFormData {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export type { User };
export type { LoginFormData, RegisterFormData };