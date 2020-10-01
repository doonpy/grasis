import useSWR from 'swr';

import { LECTURER_LIMIT } from '../services/lecturer.service';

export function useFindAllForListLecturer(pageNumber = 0) {
  const offset = pageNumber * LECTURER_LIMIT;
  const { data } = useSWR(`/lecturers?offset=${offset}&isList=1`);

  return { data, isLoading: !data };
}

export function useFindOneLecturer(id) {
  const { data } = useSWR(`/lecturers/${id}`);

  return { data, isLoading: !data };
}
