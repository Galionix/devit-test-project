import LoginButton from '../../components/login-button/login-button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export function Login(props: LoginProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/admin');
    }
  }, [router, session.status]);

  return (
    <DefaultLayout>
      <div className={styles['container']}>
        <h1>Please make login</h1>

        <LoginButton />
      </div>
    </DefaultLayout>
  );
}

export default Login;
