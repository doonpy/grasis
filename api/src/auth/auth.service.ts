import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LecturerService } from '../lecturer/lecturer.service';
import { StudentService } from '../student/student.service';
import { User } from '../user/user.entity';
import { UserStatus } from '../user/user.resource';
import { UserService } from '../user/user.service';

export interface JwtToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private lecturerService: LecturerService,
    private studentService: StudentService,
    private jwtService: JwtService
  ) {}

  public async validateUser(username: string, inputPassword: string): Promise<User | null> {
    const user: User | undefined = await this.userService.findByUsernameForAuth(username);
    const hashPassword: string = this.userService.hashPassword(inputPassword, username);
    console.log(username, inputPassword, hashPassword);
    if (user && user.password === hashPassword && user.status === UserStatus.ACTIVE) {
      return user;
    }

    return null;
  }

  public login(user: User): JwtToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payload } = user;
    return {
      accessToken: this.jwtService.sign({ user: payload })
    };
  }
}
