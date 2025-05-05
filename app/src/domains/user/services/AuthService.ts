import { User } from "../entities/User";

export interface AuthService {
  loginWithGoogle(): Promise<void>;

  logout(): Promise<void>;

  getCurrentUser(): Promise<User | null>;

  isAuthenticated(): Promise<boolean>;
}
