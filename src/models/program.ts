export type ClinicalProgram = {
  id: string;
  name: string;
  details: string;
  // isEnrolled: boolean;
};

export type UserProgramEnrollment = {
  id: string;
  careProgramId: string;
  careProgram: ClinicalProgram;
};
