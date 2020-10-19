import 'moment/locale/vi';

import moment, { Moment } from 'moment';

import { LOCAL_FORMAT } from './datetime.resource';

export default class Datetime {
  private dateTime: Moment;

  constructor(value: string | number | Date) {
    this.dateTime = moment.utc(value);
  }

  public getWithLocalTimezone(): string {
    return this.dateTime.clone().local().format(LOCAL_FORMAT);
  }

  public getRelativeTime(): string {
    return this.dateTime.clone().local().fromNow();
  }
}
