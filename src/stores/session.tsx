import EncryptedStorage from 'react-native-encrypted-storage';
import {Session, SessionStorage, SessionType} from './types';

const MASTER_SESSION_KEY = 'user_master_session';
const DELEGATE_SESSION_KEY = 'user_delegate_session';

const keyForType = (type: SessionType) => {
  return type === 'master' ? MASTER_SESSION_KEY : DELEGATE_SESSION_KEY;
};

export const secureSessionStorage: SessionStorage = {
  async clear() {
    await EncryptedStorage.clear();
  },

  async storeSession(sessionType: SessionType, session: Session) {
    await EncryptedStorage.setItem(
      keyForType(sessionType),
      JSON.stringify(session),
    );
  },

  async getSession(sessionType: SessionType): Promise<Session | null> {
    const session = await EncryptedStorage.getItem(keyForType(sessionType));
    if (session) {
      return JSON.parse(session) as Session;
    }

    return null;
  },
};
