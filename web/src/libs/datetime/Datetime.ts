import 'moment/locale/vi';

import moment, { Moment } from 'moment';

export default class Datetime {
  private readonly dateTime: Moment;

  constructor(value: string | number | Date | Moment) {
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

  public getCountDownDays(): number {
    const current = moment.utc();
    if (this.dateTime.isAfter(current)) {
      return this.dateTime.diff(current, 'days');
    }

    return 0;
  }

  public getCountDownHours(): number {
    const current = moment.utc();
    if (this.dateTime.isAfter(current)) {
      return this.dateTime.diff(current, 'hours');
    }

    return 0;
  }

  public isSameOrAfterCurrentDate(): boolean {
    return this.dateTime.isSameOrAfter(moment.utc(), 'day');
  }
}
