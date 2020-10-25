import 'moment/locale/vi';

import moment, { Moment } from 'moment';

export default class Datetime {
  private dateTime: Moment;

  constructor(value: string | number | Date) {
    this.dateTime = moment.utc(value);
  }

  public getWithLocalTimezone(): string {
    return this.dateTime.clone().local().format('LTS, L');
  }

  public getRelativeTime(): string {
    return this.dateTime.clone().local().fromNow();
  }

  public getDate(): string {
    return this.dateTime.clone().local().format('L');
  }
}
