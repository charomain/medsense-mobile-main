import {AccessibleUserProfile, UserProfile} from '@app/models/profile';
import {createContext, useContext} from 'react';

export type IPatientContext = {
  patient: AccessibleUserProfile;
  fullProfile?: UserProfile;
  refetchProfile(): void;
  isLoadingProfile: boolean;
  setPatientProfile(patient: UserProfile): void;
};

export const PatientContext = createContext<IPatientContext | undefined>(
  undefined,
);

type PatientContextAPI =
  | {
      loading: boolean;
      profile?: UserProfile;
      refetch(): void;
      setPatientProfile(patient: UserProfile): void;
    }
  | undefined;

export const usePatientContext = (): PatientContextAPI => {
  const patientProfile = useContext(PatientContext);

  return patientProfile
    ? {
        loading: patientProfile.isLoadingProfile,
        profile: patientProfile.fullProfile,
        refetch: patientProfile.refetchProfile,
        setPatientProfile: patientProfile.setPatientProfile,
      }
    : undefined;
};
