import { useEffect } from 'react';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import styles from './index.module.scss';
import LoginButton from '../../components/login-button/login-button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Table, message } from 'antd';
import AddPostModal from '../../components/add-post-modal/add-post-modal';
import { useAuthorizedRequest } from '../../hooks/useServerRequest';
import { HeadComponent } from '../../components/head/head';
import client from '../../apollo-client';
import { gql } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { SearchBar } from '../../components/search-bar/search-bar';
import AdminDisplayPosts from '../../components/admin-display-posts/admin-display-posts';




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
type TSortDirection = 'ASC' | 'DESC';

interface IQueryProps {
  searchTitle: string;
  sortDirection: TSortDirection;
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        posts(options: {}) {
          posts {
            id
            pubDate
            title
            author
            content
            link
            contentSnippet
          }
        }
      }
    `,
  });

  return {
    props: {
      posts: data.posts.posts,
    },
    revalidate: 1,
  };
}
interface AdminProps {
  posts: ArticleType[];
}

/* eslint-disable-next-line */

export function Admin(props: AdminProps) {
  const session = useSession();

  const router = useRouter();

  const data = useAuthorizedRequest('protected', 'GET', {});

  //   const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log('session.status: ', session.status);
    if (session.status !== 'authenticated') {
      //   messageApi.open({
      //     type: 'warning',
      //     content: 'You logged out or session expired',
      //     duration: 30,
      //   });

      router.push('/login');
    }
  }, [router, session.status]);

  if (session.status === 'loading' || session.status === 'unauthenticated') {
    return (
      <DefaultLayout>
        <HeadComponent title="Loading..." />
        <p>Loading...</p>
      </DefaultLayout>
    );
  }

  console.log('session.status: ', session.status);
  return (
    <DefaultLayout>
      <HeadComponent title="Admin Page" />
      {/* {contextHolder} */}
      <AddPostModal />
      <div className={styles['container']}>
        <LoginButton />
        {/* <h1>Welcome to Admin!</h1> */}
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        {/* <SearchBar initialPosts={props.posts} /> */}
        <AdminDisplayPosts />
      </div>
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </DefaultLayout>
  );
}

export default Admin;
