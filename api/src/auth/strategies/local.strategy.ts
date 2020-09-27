import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Lecturer } from '../../lecturer/lecturer.model';
import { Student } from '../../student/student.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user: Lecturer | Student | null = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Tên người dùng hoặc mật khẩu không chính xác.');
    }

    return user;
  }
}
