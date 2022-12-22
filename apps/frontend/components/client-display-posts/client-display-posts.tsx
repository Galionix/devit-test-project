import { ArticlePreview } from '../article/article';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import styles from './client-display-posts.module.scss';

/* eslint-disable-next-line */
export interface ClientDisplayPostsProps {}

export function ClientDisplayPosts(props: ClientDisplayPostsProps) {
  const { status } = useFoundPostsStore();
  const { posts } = status;
  if (!posts) return null;
  return (
    <div className={styles['container']}>
      {posts &&
        posts.map((post, index) => (
          <ArticlePreview {...post} key={`${post.id} ${index}`} />
        ))}
    </div>
  );
}

export default ClientDisplayPosts;
