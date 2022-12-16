import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  callbacks: {
    async session({ session, user, token }) {
      //   console.log('token: ', token);
      if (token) {
        session.user = token;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //   console.log('token, user, account, profile, isNewUser: ', token);
      if (user) {
        return {
          ...user,
          ...token,
        };
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60, // 60 seconds
  },
  //   jwt: {
  //     // The maximum age of the NextAuth.js issued JWT in seconds.
  //     // Defaults to `session.maxAge`.
  //     maxAge: 60, // 1 hour
  //     // You can define your own encode/decode functions for signing and encryption
  //     // async encode() {},
  //     // async decode() {},
  //   },
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here

    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jane' },
        password: { label: 'Password', type: 'password', placeholder: 'guess' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch('http://localhost:3002/api/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        // console.log('res: ', res);
        const response = await res.json();
        // console.log('user: ', response);

        const protectedRoute = await fetch(
          'http://localhost:3002/api/protected',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const protectedRouteResponse = await protectedRoute.json();
        // If no error and we have user data, return it
        if (res.ok && response) {
          //   console.log('protectedRouteResponse: ', protectedRouteResponse);
          return {
            id: protectedRouteResponse.userId,
            username: protectedRouteResponse.username,
            token: response.access_token,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
