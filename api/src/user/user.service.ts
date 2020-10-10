import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { EntityManager, Repository } from 'typeorm';

import { User } from './user.entity';
import { IsAdmin, USER_ERROR_RESOURCE, UserRequestBody, UserType } from './user.resource';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  public async findById(id: number): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }

    return user;
  }

  public async findByIdTransaction(manager: EntityManager, id: number): Promise<User> {
    const user: User | undefined = await manager.findOne<User>(User, id);
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
    return (await manager.count<User>(User, { where: { id } })) > 0;
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
      (await manager.count<User>(User, {
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

  public checkPasswordConfirm(
    password: string | undefined,
    confirmPassword: string | undefined
  ): void {
    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_3);
    }
  }

  public async createTransaction(
    manager: EntityManager,
    user: Partial<UserRequestBody>
  ): Promise<User> {
    const { username, password, confirmPassword } = user;
    await this.checkUserNotExistByUsernameTransaction(manager, username!);
    this.checkPasswordConfirm(password, confirmPassword);
    user.password = this.hashPassword(password, username!);
    const createdUser = await manager.create<User>(User, user);

    return manager.save<User>(createdUser);
  }

  public async updateByIdTransaction(
    manager: EntityManager,
    id: number,
    user: Partial<UserRequestBody>
  ): Promise<void> {
    const { username, password, confirmPassword } = user;
    const currentUser = await this.findByIdTransaction(manager, id);

    if (username && username !== currentUser.username) {
      await this.checkUserNotExistByUsernameTransaction(manager, username);
    }

    if (password) {
      this.checkPasswordConfirm(password, confirmPassword);
      user.password = this.hashPassword(password, username ? username : currentUser.username);
    }

    await manager.save(User, { ...currentUser, ...user });
  }

  public async deleteByIdTransaction(manager: EntityManager, id: number): Promise<void> {
    await manager.softDelete<User>(User, id);
  }

  public hashPassword(password: string | undefined, secret: string): string {
    if (!password) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_4);
    }

    return createHmac('sha1', password + secret.toUpperCase())
      .update(password)
      .digest('hex');
  }

  public async findByUsernameForAuth(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      select: [
        'id',
        'username',
        'password',
        'firstname',
        'lastname',
        'gender',
        'email',
        'address',
        'phone',
        'status',
        'isAdmin',
        'userType'
      ],
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
    const user = await this.usersRepository.findOne(id, { select: ['isAdmin'] });
    if (!user || user.isAdmin === IsAdmin.FALSE || user.id !== targetId) {
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

  public async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    const currentUser: User = await this.findById(id);

    await this.usersRepository.save({ ...currentUser, refreshToken });
  }
}
