import { gql } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { useEffect } from 'react';
import client from '../apollo-client';
import ClientDisplayPosts from '../components/client-display-posts/client-display-posts';
import { SearchBar } from '../components/search-bar/search-bar';
import DefaultLayout from '../layouts/default-layout/default-layout';
import useIndexPageStore from './index.store';

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
interface IIndexPageProps {
  posts: ArticleType[];
}

export function Index({ posts }: IIndexPageProps) {
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
      <SearchBar initialPosts={posts} />
      <ClientDisplayPosts />
    </DefaultLayout>
  );
}

export default Index;
