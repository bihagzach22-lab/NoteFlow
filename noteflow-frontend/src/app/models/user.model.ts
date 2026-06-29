export type UserRole = 'User' | 'Admin';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: Omit<AppUser, 'password'>;
}
