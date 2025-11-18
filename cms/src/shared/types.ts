export interface AuthState {
  isAuthenticated: boolean;
  adminSecret: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (secret: string) => void;
  logout: () => void;
}
