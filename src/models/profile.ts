// TODO: This was the name taken from the previous app. It sucks
// Need to find a better name
export type AccessibleUserProfile = {
  id: number;
  email: string;
  isConfirmed: boolean;
  token: string | null;
};

export type UserProfile = {
  id: number;
  photo: string;
  email: string;
  gender: string;
  birthday: Date | null;
  firstName: string;
  lastName: string;
  pushStatus: string;
  phoneNumber: string;
  timezone: string;
  children: AccessibleUserProfile[];
  shared: AccessibleUserProfile[];
};

export const isValidEmail = (email: string) => {
  const emailRegex = new RegExp(
    '^.+@([A-Za-z0-9-]+.)+[A-Za-z]{2}[A-Za-z]*$',
    'gi',
  );
  return emailRegex.test(email);
};

export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const isValidPassword = (password: string) => {
  return password.length >= 6;
};

export const isValidPhone = (phone: string): boolean => {
  return (
    (phone.startsWith('+1') && phone.length === 12) ||
    (phone.startsWith('1') && phone.length === 11) ||
    phone.length === 10
  );
};

export const isConfirmed = (profile: AccessibleUserProfile): boolean => {
  return profile.isConfirmed;
};

export const nameWithLastInitial = (
  profile: UserProfile | undefined,
): string | undefined => {
  if (!profile) {
    return undefined;
  }

  if (profile.firstName) {
    return [profile.firstName, profile.lastName?.substring(0, 1)]
      .filter(Boolean)
      .join(' ');
  }

  const emailParts = profile.email.split('@');
  return emailParts[0] ?? profile.email;
};
