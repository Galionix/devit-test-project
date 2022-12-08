import styles from './article.module.scss';

import { ArticleType, stripUsername } from '@devit-test-project/library';
import Link from 'next/link';

export const ArticlePreview = (props: ArticleType) => {
  const { id, title, author, content, pubDate, isoDate,link } = props;
  return (
    <article className={styles['container']}>


		  <Link className={ styles['title']} href={`/post/${id}`}>
        <span>{title}</span>
      </Link>
      {/* <p>{content}</p> */}

		  <span>{stripUsername(author)}</span>
		  <Link href={link} >
		  <code>{id}</code>
		  </Link>
		  <time dateTime={pubDate}>
        Published: {new Date(pubDate).toLocaleDateString()}
      </time>
    </article>
  );
};
