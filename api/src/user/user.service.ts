import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { EntityManager, Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { IsAdmin, UserError, UserStatus, UserType } from './user.resource';
import { User, UserAuth, UserForCommentView, UserRequestBody } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<User>
  ) {}

  public async getById(id: number): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne(id, {
      cache: true
    });
    if (!user) {
      throw new BadRequestException(UserError.ERR_1);
    }

    return user;
  }

  public async isUserExistByUsername(username: string): Promise<boolean> {
    return (await this.usersRepository.count({ username })) > 0;
  }

  public async isUserExistById(id: number): Promise<boolean> {
    return (await this.usersRepository.count({ id })) > 0;
  }

  public async checkUserNotExistByUsername(username: string): Promise<void> {
    if (await this.isUserExistByUsername(username)) {
      throw new BadRequestException(UserError.ERR_2);
    }
  }

  public checkPasswordConfirm(password?: string, confirmPassword?: string): void {
    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new BadRequestException(UserError.ERR_3);
    }
  }

  public async createUserWithTransaction(
    manager: EntityManager,
    user: UserRequestBody
  ): Promise<User> {
    const { username, password } = user;
    user.password = this.hashPassword(password, username!);
    const entity = manager.create(UserEntity, user);

    return manager.save(UserEntity, entity);
  }

  public async updateById(currentUser: User, userBody: UserRequestBody): Promise<User> {
    const { username, password, confirmPassword, userType, isAdmin } = userBody;
    this.checkStudentCantNotAdministrator(isAdmin, userType);

    if (username && username !== currentUser.username) {
      await this.checkUserNotExistByUsername(username);
    }

    if (password) {
      this.checkPasswordConfirm(password, confirmPassword);
      currentUser.password = this.hashPassword(
        password,
        username ? username : currentUser.username
      );
      delete userBody.password;
    }

    return { ...currentUser, ...userBody };
  }

  public hashPassword(password: string | undefined, secret: string): string {
    if (!password) {
      throw new BadRequestException(UserError.ERR_4);
    }

    return createHmac('sha1', password + secret.toUpperCase())
      .update(password)
      .digest('hex');
  }

  public async findForAuth(username: string, inputPassword: string): Promise<UserAuth | undefined> {
    const hashPassword = this.hashPassword(inputPassword, username);

    return this.usersRepository.findOne({
      where: {
        username,
        password: hashPassword,
        status: UserStatus.ACTIVE
      }
    });
  }

  public async checkUserExistById(id: number): Promise<void> {
    if (!(await this.isUserExistById(id))) {
      throw new BadRequestException(UserError.ERR_1);
    }
  }

  public async checkUserIsAdminById(id: number): Promise<boolean> {
    if (
      !(await this.usersRepository.count({
        id,
        isAdmin: IsAdmin.TRUE
      }))
    ) {
      throw new UnauthorizedException(UserError.ERR_5);
    }

    return true;
  }

  public async checkUserHasPermission(id: number, targetId: number): Promise<boolean> {
    const user = await this.getById(id);
    if (!user) {
      return false;
    }

    if (user.id !== targetId) {
      throw new UnauthorizedException(UserError.ERR_5);
    }

    return true;
  }

  public async checkUserTypeById(id: number, userTypes: UserType[]): Promise<boolean> {
    const user = await this.getById(id);
    if (!user || !userTypes.includes(user.userType)) {
      throw new UnauthorizedException(UserError.ERR_5);
    }

    return true;
  }

  public checkStudentCantNotAdministrator(isAdmin?: IsAdmin, userType?: UserType): void {
    if (
      typeof userType !== 'undefined' &&
      typeof isAdmin !== 'undefined' &&
      userType === UserType.STUDENT &&
      isAdmin === IsAdmin.TRUE
    ) {
      throw new BadRequestException(UserError.ERR_7);
    }
  }

  public convertToCommentView(user: User): UserForCommentView {
    const { id, firstname, lastname } = user;

    return { id, firstname, lastname };
  }

  public async validate(user: UserRequestBody): Promise<void> {
    const { username, password, confirmPassword, userType, isAdmin } = user;
    this.checkStudentCantNotAdministrator(isAdmin, userType);
    await this.checkUserNotExistByUsername(username);
    this.checkPasswordConfirm(password, confirmPassword);
  }
}
