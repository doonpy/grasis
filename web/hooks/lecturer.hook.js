import useSWR from 'swr';

import { LECTURER_LIMIT } from '../services/lecturer/lecturer.service';

export function useFindAllForListLecturer(pageNumber = 0) {
  const offset = (pageNumber - 1) * LECTURER_LIMIT;
  const { data } = useSWR(`/lecturers?offset=${offset}`);

  return { data, isLoading: !data };
}

export function useFindOneLecturer(id) {
  const { data } = useSWR(`/lecturers/${id}`);

  return { data, isLoading: !data };
}
