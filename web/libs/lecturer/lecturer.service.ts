import LecturerBase from './lecturer.base';

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
}
