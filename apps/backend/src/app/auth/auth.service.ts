import { Injectable } from '@nestjs/common';
import {
  User,
  UserBasicInfo,
  UsersService,
} from '../../app/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserBasicInfo | null> {
    const user = await this.usersService.findOne(username);

    //   TODO: check hash?
    if (user && password === user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, username, ...rest } = user;
      return rest;
    }
    return null;
  }
}
