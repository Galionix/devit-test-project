import { gql } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import client from '../../apollo-client';
import AddPostModal from '../../components/add-post-modal/add-post-modal';
import AdminDisplayPosts from '../../components/admin-display-posts/admin-display-posts';
import { HeadComponent } from '../../components/head/head';
import LoginButton from '../../components/login-button/login-button';
import { useAuthorizedRequest } from '../../hooks/useServerRequest';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import styles from './index.module.scss';

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

  useEffect(() => {
    if (session.status !== 'authenticated') {
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

  return (
    <DefaultLayout>
      <HeadComponent title="Admin Page" />
      <div className={styles['toolbar']}>
        <AddPostModal />
        <LoginButton />
      </div>
      <div className={styles['container']}>
        <AdminDisplayPosts />
      </div>
    </DefaultLayout>
  );
}

export default Admin;
