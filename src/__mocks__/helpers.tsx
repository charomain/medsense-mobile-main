import {FC, PropsWithChildren} from 'react';
import {UserContext} from '@app/contexts/user';
import {ThemeContext} from '@app/contexts/theme';

export const createMockNavigationProps = () => {
  return {
    navigation: {} as any,
    route: {} as any,
  };
};

export const MockAppProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <UserContext.Provider value={{} as any}>
      {/* <ThemeContext.Provider value={{themeMode: null, setThemeMode: jest.fn()}}>
        {children}
      </ThemeContext.Provider> */}
    </UserContext.Provider>
  );
};

declare let global: any;

export const mockSuccesfulResponse = (status = 200, returnBody?: object) => {
  (global as any).fetch = jest.fn().mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve({
        ok: true,
        status,
        headers: {
          get(key: string) {
            if (key === 'content-type') {
              return 'json';
            }
          },
        },
        json: () => {
          return returnBody ? returnBody : {};
        },
      });
    });
  });
};

export const wait = (ms: number) => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
};
