import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { USER_ERROR_RESOURCE } from './user.resource';
import { createHmac } from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async findAll(offset: number, limit: number): Promise<User[]> {
    return this.userModel.findAll({ offset, limit });
  }

  public async findById(id: number): Promise<User> {
    const user: User | null = await this.userModel.findByPk(id);
    if (!user) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_1);
    }

    return user;
  }

  public async isUsernameExist(username: string): Promise<boolean> {
    return (
      (await this.userModel.count({
        where: { username }
      })) > 0
    );
  }

  public async create(createValue: User): Promise<User> {
    const { username } = createValue;
    if (await this.isUsernameExist(username)) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_2);
    }

    createValue.password = this.hashPassword(createValue.password, createValue.username);

    return this.userModel.create(createValue);
  }

  public async updateById(id: number, updateValue: Partial<User>): Promise<User> {
    const { username } = updateValue;
    if (username && (await this.isUsernameExist(username))) {
      throw new BadRequestException(USER_ERROR_RESOURCE.USER_ERR_2);
    }

    const user: User = await this.findById(id);
    if (updateValue.password) {
      updateValue.password = this.hashPassword(
        updateValue.password,
        username ? username : user.username
      );
    }
    return user.update(updateValue);
  }

  public async deleteById(id: number): Promise<void> {
    const user: User = await this.findById(id);
    await user.destroy();
  }

  public hashPassword(password: string, secret: string): string {
    return createHmac('sha1', password + secret.toUpperCase())
      .update(password)
      .digest('hex');
  }
}
