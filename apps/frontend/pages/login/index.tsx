import LoginButton from '../../components/login-button/login-button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import styles from './index.module.scss';
import { Table, message } from 'antd';
import { HeadComponent } from '../../components/head/head';

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

  // useEffect(() => {
  //   messageApi.open({
  //     type: 'warning',
  //     content: 'You logged out or session expired',
  //   });
  // }, [messageApi]);
  return (
    <DefaultLayout>
      <HeadComponent title="Login Page" />
      <div className={styles['container']}>
        <h1>Please make login</h1>

        <LoginButton />
      </div>
    </DefaultLayout>
  );
}

export default Login;
