export type SessionType = 'master' | 'delegate';

export type Session = {
  accessToken: string;
};

export interface SessionStorage {
  clear(): Promise<void>;
  storeSession(sessionType: SessionType, session: Session): Promise<void>;
  getSession(sessionType: SessionType): Promise<Session | null>;
}
