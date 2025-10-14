import {useCallback} from 'react';
import {useState} from 'react';
import {useMedsenseAPIRequest} from '@app/services/api';
import {registerRequest, loginRequest} from '@app/services/api/auth';
import {useAuthStore} from '@app/stores/auth';

type RegisterAPI = {
  loading: boolean;
  error?: Error;
  register(email: string, password: string): void;
};

export const useRegisterAPI = (
  onSuccess: (email: string) => void,
): RegisterAPI => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const register = useMedsenseAPIRequest(registerRequest);
  const login = useMedsenseAPIRequest(loginRequest);

  const {saveSession} = useAuthStore();

  const registerWrapped = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(undefined);

      try {
        await register({
          variables: {
            email,
            password,
          },
        });

        const tokenResponse = await login({
          variables: {
            email,
            password,
          },
        });

        await saveSession('master', {
          accessToken: tokenResponse.token,
        });

        onSuccess(email);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, register, login, onSuccess, saveSession],
  );

  return {
    loading,
    error,
    register: registerWrapped,
  };
};
