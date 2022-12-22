import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  callbacks: {
    async session({ session, user, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
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
    maxAge: 3600, // 1 hour
  },

  // Configure one or more authentication providers
  providers: [
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
        const response = await res.json();

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
