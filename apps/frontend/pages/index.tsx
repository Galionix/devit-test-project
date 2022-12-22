import { gql } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { useFoundPostsStore } from '../components/search-bar/post-search.store';
import { useEffect, useState } from 'react';
import client from '../apollo-client';
import { ArticlePreview } from '../components/article/article';
import { SearchBar, ISearchResult } from '../components/search-bar/search-bar';
import DefaultLayout from '../layouts/default-layout/default-layout';
import styles from './index.module.scss';
import ClientDisplayPosts from '../components/client-display-posts/client-display-posts';
import { useIndexPageStore } from './index.store';

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
  console.log('data: ', data.posts.posts);

  return {
    props: {
      posts: data.posts.posts,
    },
    revalidate: 1,
  };
}
interface IIndexPageProps {
  posts: ArticleType[];
}

export function Index({ posts }: IIndexPageProps) {
  //   { posts }: IIndexPageProps
  //   const [search, setSearch] = useState<ISearchResult>();
  //   const { status } = useFoundPostsStore();
  //   const { posts: foundPosts } = status;
  //   console.log('search: ', search);

  const { scrollPosition, setScrollPosition } = useIndexPageStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    window.scrollTo(0, scrollPosition);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition, setScrollPosition]);

  return (
    <DefaultLayout>
      <SearchBar
        initialPosts={posts}
        //   onSearch={(res) => setSearch(res)}
      />
      {/* <pre>{JSON.stringify(status, null, 2)}</pre> */}
      <ClientDisplayPosts />
      {/* <div className={styles['articlesContainer']}>
        {posts &&
          posts.map((post, index) => {
            return <ArticlePreview {...post} key={`${post.id} ${index}`} />;
          })}
      </div> */}
    </DefaultLayout>
  );
}

export default Index;
