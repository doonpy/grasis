import { User } from '../user.interface';

export default class LoginUser {
  private static instance: LoginUser;
  private user: User;

  public static getInstance(): LoginUser {
    if (!this.instance) {
      this.instance = new LoginUser();
    }

    return this.instance;
  }

  public setUser(user: User): void {
    this.user = user;
  }

  public getId(): number {
    return this.user.id;
  }
}
