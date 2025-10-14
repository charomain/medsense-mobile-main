import {UserProfile} from '@app/models/profile';
import {SessionType, Session} from '@app/stores/types';
import {createContext} from 'react';

export type IUserContext = {
  isInitializing: boolean;
  isLoggedIn: boolean;
  isRefetchingProfile: boolean;
  profile: UserProfile | null;
  setProfile(profile: UserProfile | null): void;
  setIsLoggedIn(isLoggedIn: boolean): void;
  saveSession(sessionType: SessionType, session: Session): Promise<void>;
  fetchProfile(): Promise<void>;
};

export const UserContext = createContext<IUserContext | undefined>(undefined);
