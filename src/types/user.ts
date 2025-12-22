// User type definition based on Redux auth state
export interface User {
  _id: string;
  user_number: string;
  name: string;
  email: string;
  phoneNumber: string;
  userName: string;
  profilePic: string;
  userStatus: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  jwtToken: string;
  isTrialExpired: boolean;
}

// Auth slice state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Root state type
import store from '../reduxToolkit/store';
export type AppRootState = ReturnType<typeof store.getState>;
