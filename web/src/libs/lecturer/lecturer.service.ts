import { TransferItem } from 'antd/lib/transfer';
import useSWR from 'swr';

import LecturerBase from './lecturer.base';
import { LecturerApi } from './lecturer.resource';
import { FindOneLecturerResponse, LecturerSearchAttendee, UseLecturer } from './lecturer.type';

export default class LecturerService extends LecturerBase {
  private static instance: LecturerService;

  constructor() {
    super();
  }

  public static getInstance(): LecturerService {
    if (!this.instance) {
      this.instance = new LecturerService();
    }

    return this.instance;
  }

  public convertToTransferItem(attendees: LecturerSearchAttendee[]): TransferItem[] {
    return attendees.map(({ id, fullName, attendeeId }) => ({
      key: id.toString(),
      fullName: fullName,
      attendeeId: attendeeId
    }));
  }

  public useLecturer(id: number): UseLecturer {
    const { data } = useSWR<FindOneLecturerResponse>(this.replaceParams(LecturerApi.SPECIFY, [id]));
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      data.lecturer.level = data.lecturer.level.split(';');
    }

    return { data, isLoading: !data };
  }
}
