import { ArticlePreview } from '../article/article';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import styles from './client-display-posts.module.scss';

/* eslint-disable-next-line */
export interface ClientDisplayPostsProps {}

export function ClientDisplayPosts(props: ClientDisplayPostsProps) {
  const { status } = useFoundPostsStore();
  const { posts } = status;
  return (
    <div className={styles['container']}>
      {/* <pre>{JSON.stringify(status, null, 2)}</pre> */}
      {posts &&
        posts.map((post, index) => (
          <ArticlePreview {...post} key={`${post.id} ${index}`} />
        ))}
    </div>
  );
}

export default ClientDisplayPosts;
