import s from './article.module.scss';

import { ArticleType, stripUsername } from '@devit-test-project/library';
import Link from 'next/link';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import { Spin } from 'antd';
interface ArticlePreviewProps extends ArticleType {
  search?: string;
}

export const ArticlePreview = (props: ArticlePreviewProps) => {
  const { id, title, author, content, pubDate, isoDate, link } = props;
  const { status } = useFoundPostsStore();
  const { keyword, loading } = status;

  const TitleComponent = keyword ? (
    <Link href={`/post/${id}`}>
      <span
        dangerouslySetInnerHTML={{
          __html: title.replace(
            new RegExp(keyword, 'gi'),
            `<span class="${s['highlight']}">${keyword}</span>`
          ),
        }}
      />
    </Link>
  ) : (
    <Link href={`/post/${id}`}>
      <span>{title}</span>
    </Link>
  );

  return (
    <Spin spinning={loading}>
      <article className={s['container']}>
        {TitleComponent}

        <span>{stripUsername(author)}</span>
        {/* <Link href={link}>
        <code>{id}</code>
	</Link> */}
        <time dateTime={pubDate}>
          Published: {new Date(pubDate).toLocaleDateString()}
        </time>
      </article>
    </Spin>
  );
};
