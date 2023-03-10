import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    // here we provide configuration for JWT strategy
    super({
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // TODO: return user info from db and specify return type and extract to library
  // validation happened before, in constructor
  async validate(payload: AuthPayload) {
    // const user = await this.usersService.findOne(payload.sub);
    return {
      userId: payload.sub,
      username: payload.name,
      // ...user
    };
  }
}
