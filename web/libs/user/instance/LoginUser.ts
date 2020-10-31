import { User } from '../user.interface';
import { IsAdmin, UserType } from '../user.resource';

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

  public isAdmin(): boolean {
    return this.user.isAdmin === IsAdmin.TRUE;
  }

  public isLecturer(): boolean {
    return this.user.userType === UserType.LECTURER;
  }

  public getFirstname(): string {
    return this.user.firstname;
  }

  public getLastname(): string {
    return this.user.lastname;
  }
}
