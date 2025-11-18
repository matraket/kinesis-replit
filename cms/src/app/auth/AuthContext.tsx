import { createContext } from 'react';
import { AuthContextValue } from '@/shared/types';

export const AuthContext = createContext<AuthContextValue | null>(null);
