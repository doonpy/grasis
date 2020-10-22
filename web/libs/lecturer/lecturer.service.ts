import { TransferItem } from 'antd/lib/transfer';

import LecturerBase from './lecturer.base';
import { LecturerSearchAttendee } from './lecturer.interface';

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
}
