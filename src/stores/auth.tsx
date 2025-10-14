import React, {useCallback} from 'react';
import {secureSessionStorage} from './session';
import {UserContext, IUserContext} from '@app/contexts/user';
import {useContext} from 'react';
import {profileRequest} from '@app/services/api/profile';
import {useMedsenseAPIRequest} from '@app/services/api';

import {UserProfile, AccessibleUserProfile} from '@app/models/profile';

export const AuthenticationProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isRefetchingProfile, setIsRefetchingProfile] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  const fetchProfile = useMedsenseAPIRequest(profileRequest);
  const fetchProfileWrapped = useCallback(async () => {
    setIsRefetchingProfile(true);
    try {
      const token = await secureSessionStorage.getSession('master');
      if (token) {
        const profileResponse = await fetchProfile({variables: undefined});
        setProfile(profileResponse);
      }
      setIsInitializing(false);
      setIsLoggedIn(!!token);
      setIsRefetchingProfile(false);
    } catch {
      setIsInitializing(false);
      setIsLoggedIn(false);
      setIsRefetchingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchProfileWrapped();
  }, [fetchProfileWrapped]);

  return (
    <UserContext.Provider
      value={{
        setIsLoggedIn,
        isInitializing,
        isLoggedIn,
        profile,
        setProfile,
        saveSession: secureSessionStorage.storeSession,
        fetchProfile: fetchProfileWrapped,
        isRefetchingProfile,
      }}>
      {children}
    </UserContext.Provider>
  );
};

type AuthenticationStatus = {
  isInitializing: boolean;
  isLoggedIn: boolean;
};

export const useAuthenticationStatus = (): AuthenticationStatus => {
  const ctx = useContext(UserContext)!;
  return ctx;
};

export const useAuthStore = (): IUserContext => {
  return useContext(UserContext)!;
};

export const useSignOut = () => {
  const auth = useContext(UserContext);
  const signout = useCallback(async () => {
    await secureSessionStorage.clear();
    auth?.setIsLoggedIn(false);
    auth?.setProfile(null);
  }, [auth]);

  return signout;
};

export const useManagedAccounts = (): AccessibleUserProfile[] => {
  const ctx = useContext(UserContext);
  return ctx?.profile?.children ?? [];
};

export const useProfile = (): UserProfile => {
  const ctx = useContext(UserContext);

  return ctx?.profile!;
};
