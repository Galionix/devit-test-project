import { User } from '@devit-test-project/library';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {
    /** OpenID ID Token */
    name: string;
    token: string;
  }
}

type TUser = {
  token: string;
} & User;

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: TUser;
  }
}
