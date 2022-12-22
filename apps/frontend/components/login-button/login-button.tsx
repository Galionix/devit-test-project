import { Button } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';

/* eslint-disable-next-line */
export interface LoginButtonProps {}

export function LoginButton(props: LoginButtonProps) {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

export default LoginButton;
