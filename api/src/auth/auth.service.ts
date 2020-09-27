import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, UserType } from '../user/user.model';
import { Lecturer } from '../lecturer/lecturer.model';
import { Student } from '../student/student.model';
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

  public async validateUser(
    username: string,
    inputPassword: string
  ): Promise<Lecturer | Student | null> {
    const user: User | null = await this.userService.findByUsername(username);
    const hashPassword: string = this.userService.hashPassword(inputPassword, username);

    if (user && user.password === hashPassword) {
      if (user.userType === UserType.LECTURER) {
        return this.lecturerService.findById(user.id);
      }

      if (user.userType === UserType.STUDENT) {
        return this.studentService.findById(user.id);
      }
    }

    return null;
  }

  public login(user: Lecturer | User): JwtToken {
    return {
      accessToken: this.jwtService.sign({ user })
    };
  }
}
