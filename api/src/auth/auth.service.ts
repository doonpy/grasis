import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';

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
    const user: User | null = await this.userService.findByUsernameForAuth(username);
    const hashPassword: string = this.userService.hashPassword(inputPassword, username);

    if (user && user.password === hashPassword) {
      return user;
    }

    return null;
  }

  public login(user: User): JwtToken {
    return {
      accessToken: this.jwtService.sign({ user })
    };
  }
}
