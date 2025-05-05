export interface AuthService {
  loginWithGoogle(): Promise<void>;

  logout(): Promise<void>;
}
