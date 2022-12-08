import { gql } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { useState } from 'react';
import client from '../apollo-client';
import { ArticlePreview } from '../components/article/article';
import SearchBar, { ISearchResult } from '../components/search-bar/search-bar';
import DefaultLayout from '../layouts/default-layout/default-layout';
import styles from './index.module.scss';
export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        posts(options: {}) {
          id
          pubDate
          title
          author
          content
          link
          contentSnippet
        }
      }
    `,
  });

  return {
    props: {
      posts: data.posts,
    },
    revalidate: 1,
  };
}
interface IIndexPageProps {
  posts: ArticleType[];
}

export function Index({ posts }: IIndexPageProps) {
	const [search, setSearch] = useState<ISearchResult>();
	console.log('search: ', search);

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
	  <DefaultLayout>
		  <SearchBar onSearch={(res)=>setSearch(res)}/>
		  <div className={styles['articlesContainer']}>
      {posts &&
        posts.map((post, index) => {
			return <ArticlePreview {...post} key={`${post.id} ${index}`} />;
        })}
		</div>
    </DefaultLayout>
  );
}

export default Index;
