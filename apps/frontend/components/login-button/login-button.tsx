import styles from './login-button.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from 'antd';

/* eslint-disable-next-line */
export interface LoginButtonProps {}

export function LoginButton(props: LoginButtonProps) {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

        {/* Signed in as {session.user.email} */}
        {/* <br /> */}
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <>
      {/* Not signed in <br /> */}
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

export default LoginButton;
