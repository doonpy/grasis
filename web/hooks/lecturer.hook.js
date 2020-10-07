import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../module/lecturer/lecturer.service';

export function useFindAllForListLecturer(pageNumber = 0, pageSize = DEFAULT_PAGE_SIZE) {
  const offset = (pageNumber - 1) * pageSize;
  const { data } = useSWR(`/lecturers?offset=${offset}`);

  return { data, isLoading: !data };
}

export function useFindOneLecturer(id) {
  const { data } = useSWR(`/lecturers/${id}`);

  return { data, isLoading: !data };
}
