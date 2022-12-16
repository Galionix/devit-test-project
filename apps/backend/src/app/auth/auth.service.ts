import { Injectable } from '@nestjs/common';
import { UsersService } from '../../app/users/users.service';
import { User, UserBasicInfo } from '@devit-test-project/library';
import { JwtService } from '@nestjs/jwt';
import { ILoginResponse } from '@devit-test-project/library';
import { ConfigService } from '@nestjs/config';

export type AuthPayload = {
  name: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
    private readonly configService: ConfigService
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
    const payload: AuthPayload = {
      name: user.name,
      sub: user.id,
    };

    const expire = new Date();
    expire.setSeconds(
      expire.getSeconds() + parseInt(this.configService.get('JWT_EXPIRE'))
    );
    return {
      access_token: this.JwtService.sign(payload),
      expire,
    };
  }
}
