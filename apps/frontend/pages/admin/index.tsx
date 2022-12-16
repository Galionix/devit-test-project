import { useEffect } from 'react';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import styles from './index.module.scss';
import { useAdminStoreStore } from './admin.store';
import LoginButton from '../../components/login-button/login-button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Table } from 'antd';
import AddPostModal from '../../components/add-post-modal/add-post-modal';
import { useServerRequest } from '../../hooks/useServerRequest';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

/* eslint-disable-next-line */
export interface AdminProps {}

export function Admin(props: AdminProps) {
  const session = useSession();
  console.log('session: ', session);
  const router = useRouter();

  //   useEffect(() => {
  //     const checkProtected = async () => {
  //       if (!session.data) return;
  //       console.log('session.data.user.token: ', session.data.user.token);
  //       const response = await checkLogin(session.data.user.token);
  //     };
  //     checkProtected();
  //   }, [session.status]);

  const authState = useServerRequest('http://localhost:3002/api/protected');
  console.log('authState: ', authState);

  useEffect(() => {
    if (session.status !== 'authenticated') {
      router.push('/login');
    }
  }, [router, session.status]);

  return (
    <DefaultLayout>
      <AddPostModal />
      <div className={styles['container']}>
        <LoginButton />
        <h1>Welcome to Admin!</h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <Table dataSource={dataSource} columns={columns} />
    </DefaultLayout>
  );
}

export default Admin;
