import { IsAdmin, UserType } from '../user.resource';
import { User } from '../user.type';

export default class LoginUser {
  private static instance: LoginUser;
  private user!: User;

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

  public getFirstname(): string | null {
    return this.user.firstname;
  }

  public getLastname(): string | null {
    return this.user.lastname;
  }

  public isStudent(): boolean {
    return this.user.userType === UserType.STUDENT;
  }

  public getFullName(): string {
    return `${this.user.lastname || ''} ${this.user.firstname || ''}`;
  }
}
