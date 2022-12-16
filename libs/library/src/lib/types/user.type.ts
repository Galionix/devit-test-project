export type UserBasicInfo = {
  id: string;
  name: string;
};
export type UserExtendedInfo = {
  username: string;
  password: string;
};
export type User = UserBasicInfo & UserExtendedInfo;
