import { Injectable } from '@nestjs/common';
import {
  User,
  UserBasicInfo,
  UsersService,
} from '../../app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ILoginResponse } from '../app.controller';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserBasicInfo | null> {
    const user = await this.usersService.findOne(username);

    //   TODO: login: check hash?
    if (user && password === user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, username, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: User): Promise<ILoginResponse> {
    const payload = {
      name: user.name,
      sub: user.id,
    };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
