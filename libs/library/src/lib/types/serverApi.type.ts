/* eslint-disable @typescript-eslint/no-empty-interface */
import { UserExtendedInfo, UserBasicInfo } from './user.type';

type IEndpoint<Endpoint, Method, RequestBody, Response> = (
  url: Endpoint,
  method: Method,
  request: RequestBody
) => { data: Response };

type tProtected = IEndpoint<'protected', 'GET', unknown, UserBasicInfo>;

export interface ILoginRequest extends UserExtendedInfo {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  expire: Date;
}

type tLogin = IEndpoint<'login', 'POST', ILoginRequest, ILoginResponse>;

export type Api = tProtected & tLogin;
