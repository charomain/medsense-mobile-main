import {useCallback} from 'react';
import {useState} from 'react';
import {useMedsenseAPIRequest} from '@app/services/api';
import {loginRequest} from '@app/services/api/auth';
import {useAuthStore} from '@app/stores/auth';

type LoginAPI = {
  loading: boolean;
  error?: Error;
  login(email: string, password: string): void;
};

export const useLoginAPI = (onSuccess: () => void): LoginAPI => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const login = useMedsenseAPIRequest(loginRequest);

  const {saveSession, fetchProfile} = useAuthStore();

  const loginWrapped = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(undefined);

      try {
        const tokenResponse = await login({
          variables: {
            email,
            password,
          },
        });

        await saveSession('master', {
          accessToken: tokenResponse.token,
        });

        await fetchProfile();

        onSuccess();
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, login, onSuccess, saveSession, fetchProfile],
  );

  return {
    loading,
    error,
    login: loginWrapped,
  };
};
