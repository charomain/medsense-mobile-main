import {AccessibleUserProfile} from '@app/models/profile';

export type CarePortalAPI = {
  loading: boolean;
  error?: Error;
  shareProfileWith(email: string): void;
  stopSharingWith(user: AccessibleUserProfile): void;

  rejectSharingFrom(user: AccessibleUserProfile): void;
  acceptSharingFrom(user: AccessibleUserProfile): void;

  releaseAccessTo(user: AccessibleUserProfile): void;

  refresh(): void;

  patients?: AccessibleUserProfile[];
  careGivers?: AccessibleUserProfile[];

  unconfirmedPatients?: AccessibleUserProfile[];
  unconfirmedCareGivers?: AccessibleUserProfile[];
};
