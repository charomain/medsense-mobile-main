import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ClinicalProgram} from '@app/models/program';
import {
  useMedsenseAPIRequest,
  useWrappedMedsenseAPIRequest,
} from '@app/services/api';
import {
  enrollInProgram,
  fetchPrograms,
  fetchUserPrograms,
} from '@app/services/api/programs';
import {showErrorAlert} from '@app/shared/utils';

export type UserClinicalProgram = ClinicalProgram & {
  isEnrolled: boolean;
};

type ProgramsAPI = {
  loading: boolean;
  data: UserClinicalProgram[];
  onPressEnroll(program: UserClinicalProgram): void;
};

export const useProgramsAPI = (): ProgramsAPI => {
  const fetchProgramsRequest = useMedsenseAPIRequest(fetchPrograms);
  const fetchUserProgramsRequest = useMedsenseAPIRequest(fetchUserPrograms);
  const enrollRequest = useWrappedMedsenseAPIRequest(enrollInProgram);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserClinicalProgram[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [programs, userPrograms] = await Promise.all([
          fetchProgramsRequest({
            variables: undefined,
          }),
          fetchUserProgramsRequest({
            variables: undefined,
          }),
        ]);

        const enrolledPrograms = new Set(
          userPrograms.map(p => p.careProgramId),
        );
        setData(
          programs.map(p => {
            return {
              ...p,
              isEnrolled: enrolledPrograms.has(p.id),
            };
          }),
        );
      } catch (error) {
        showErrorAlert(error);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressEnroll = useCallback(
    async (program: ClinicalProgram) => {
      setLoading(true);
      await enrollRequest.request({
        id: program.id,
      });

      Alert.alert('Thanks for enrolling!', '');

      setData(
        data.map(p => {
          if (p.name !== program.name) {
            return p;
          }

          return {
            ...p,
            isEnrolled: !p.isEnrolled,
          };
        }),
      );

      setLoading(false);
    },
    [data, enrollRequest],
  );

  return {
    loading: loading || enrollRequest.loading,
    data,
    onPressEnroll,
  };
};
