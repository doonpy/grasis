import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { EntityManager, Repository } from 'typeorm';

import { LecturerRequestBody } from '../lecturer/lecturer.interface';
import { RefreshService } from '../refresh/refresh.service';
import { StudentRequestBody } from '../student/student.interface';
import { UserEntity } from './user.entity';
import {
  SplitUserFromRequestBody,
  User,
  UserAuth,
  UserRequestBody,
  UserView
} from './user.interface';
import { IsAdmin, USER_ERROR_RESOURCE, UserType } from './user.resource';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<User>,
    private readonly refreshService: RefreshService
  ) {}

  public async findById(id: number): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }

    return user;
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<User> {
    const user: User | undefined = await manager.findOne<User>(UserEntity, id);
    if (!user) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }

    return user;
  }

  public async isUserExistByUsername(username: string): Promise<boolean> {
    return (
      (await this.usersRepository.count({
        where: { username }
      })) > 0
    );
  }

  public async isUserExistById(id: number): Promise<boolean> {
    return (
      (await this.usersRepository.count({
        where: { id }
      })) > 0
    );
  }

  public async checkUserNotExistByUsername(username: string): Promise<void> {
    if (await this.isUserExistByUsername(username)) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_2);
    }
  }

  public async isUserExistByIdTransaction(manager: EntityManager, id: number): Promise<boolean> {
    return (await manager.count<User>(UserEntity, { where: { id } })) > 0;
  }

  public async checkUserExistByIdTransaction(manager: EntityManager, id: number): Promise<void> {
    if (!(await this.isUserExistByIdTransaction(manager, id))) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }
  }

  public async isUserExistByUsernameTransaction(
    manager: EntityManager,
    username: string
  ): Promise<boolean> {
    return (
      (await manager.count<User>(UserEntity, {
        where: { username }
      })) > 0
    );
  }

  public async checkUserNotExistByUsernameTransaction(
    manager: EntityManager,
    username: string
  ): Promise<void> {
    if (await this.isUserExistByUsernameTransaction(manager, username)) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_2);
    }
  }

  public checkPasswordConfirm(password?: string, confirmPassword?: string): void {
    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_3);
    }
  }

  public async createTransaction(
    manager: EntityManager,
    user: Partial<UserRequestBody>
  ): Promise<User> {
    const { username, password, confirmPassword, userType, isAdmin } = user;
    this.checkStudentCantNotAdministrator(isAdmin, userType);

    await this.checkUserNotExistByUsernameTransaction(manager, username!);
    this.checkPasswordConfirm(password, confirmPassword);
    user.password = this.hashPassword(password, username!);
    const createdUser = manager.create<User>(UserEntity, user);

    return manager.save(createdUser);
  }

  public async updateByIdTransaction(
    manager: EntityManager,
    id: number,
    user: Partial<UserRequestBody>
  ): Promise<void> {
    const { username, password, confirmPassword, userType, isAdmin } = user;
    this.checkStudentCantNotAdministrator(isAdmin, userType);

    const currentUser = await this.findByIdTransaction(manager, id);

    if (username && username !== currentUser.username) {
      await this.checkUserNotExistByUsernameTransaction(manager, username);
    }

    if (password) {
      this.checkPasswordConfirm(password, confirmPassword);
      user.password = this.hashPassword(password, username ? username : currentUser.username);
    }

    delete user.confirmPassword;
    await manager.update<User>(UserEntity, id, this.filterNullProperties(user));
  }

  public async deleteByIdTransaction(manager: EntityManager, id: number): Promise<void> {
    await this.refreshService.deleteByUserIdTransaction(manager, id);
    await manager.softDelete<User>(UserEntity, id);
  }

  public hashPassword(password: string | undefined, secret: string): string {
    if (!password) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_4);
    }

    return createHmac('sha1', password + secret.toUpperCase())
      .update(password)
      .digest('hex');
  }

  public async findByUsernameForAuth(username: string): Promise<UserAuth | undefined> {
    return this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'status'],
      where: { username }
    });
  }

  public async checkUserExistById(id: number): Promise<void> {
    if (!(await this.isUserExistById(id))) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }
  }

  public async checkUserIsAdminById(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(id, { select: ['isAdmin'] });
    if (!user || user.isAdmin === IsAdmin.FALSE) {
      throw new UnauthorizedException(USER_ERROR_RESOURCE.USER_ERR_5);
    }

    return true;
  }

  public async checkUserHasPermission(id: number, targetId: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(id, { select: ['id'] });
    if (!user) {
      return false;
    }

    if (user.id !== targetId) {
      throw new UnauthorizedException(USER_ERROR_RESOURCE.USER_ERR_5);
    }

    return true;
  }

  public async checkUserTypeById(id: number, userTypes: UserType[]): Promise<boolean> {
    const user = await this.usersRepository.findOne(id, { select: ['userType'] });
    if (!user || !userTypes.includes(user.userType)) {
      throw new UnauthorizedException(USER_ERROR_RESOURCE.USER_ERR_5);
    }

    return true;
  }

  public async isRefreshTokenExist(id: number, refreshToken: string): Promise<boolean> {
    return (await this.usersRepository.count({ where: { id, refreshToken } })) > 0;
  }

  public convertToView(user: User): UserView {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  public splitUserFromRequestBody(
    body: LecturerRequestBody | StudentRequestBody
  ): SplitUserFromRequestBody {
    const {
      username,
      password,
      confirmPassword,
      firstname,
      lastname,
      gender,
      email,
      address,
      phone,
      status,
      userType,
      isAdmin,
      ...remain
    } = body;

    const user: UserRequestBody = {
      username,
      password,
      confirmPassword,
      firstname,
      lastname,
      gender,
      email,
      address,
      phone,
      status,
      userType,
      isAdmin
    };

    return { user, remain };
  }

  public filterNullProperties({
    username,
    password,
    firstname,
    lastname,
    gender,
    email,
    address,
    phone,
    status,
    userType,
    isAdmin
  }: UserRequestBody): UserRequestBody {
    const result: UserRequestBody = {};
    if (typeof username !== 'undefined' && username !== null) {
      result.username = username;
    }

    if (typeof password !== 'undefined' && password !== null) {
      result.password = password;
    }
    if (typeof firstname !== 'undefined' && firstname !== null) {
      result.firstname = firstname;
    }
    if (typeof lastname !== 'undefined' && lastname !== null) {
      result.lastname = lastname;
    }
    if (typeof gender !== 'undefined' && gender !== null) {
      result.gender = gender;
    }
    if (typeof email !== 'undefined' && email !== null) {
      result.email = email;
    }
    if (typeof address !== 'undefined' && address !== null) {
      result.address = address;
    }
    if (typeof phone !== 'undefined' && phone !== null) {
      result.phone = phone;
    }
    if (typeof status !== 'undefined' && status !== null) {
      result.status = status;
    }
    if (typeof userType !== 'undefined' && userType !== null) {
      result.userType = userType;
    }
    if (typeof isAdmin !== 'undefined' && isAdmin !== null) {
      result.isAdmin = isAdmin;
    }

    return result;
  }

  private checkStudentCantNotAdministrator(isAdmin?: IsAdmin, userType?: UserType): void {
    if (
      typeof userType !== 'undefined' &&
      typeof isAdmin !== 'undefined' &&
      userType === UserType.STUDENT &&
      isAdmin === IsAdmin.TRUE
    ) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_7);
    }
  }
}
