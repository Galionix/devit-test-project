import s from './article.module.scss';

import { ArticleType, stripUsername } from '@devit-test-project/library';
import Link from 'next/link';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import { Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect, memo } from 'react';
import { parseLink } from '../../pages/post/[id]';

const PreviewResult = ({ link }: { link: string }) => {
  const [previewAvailable, setPreviewAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPreview = async () => {
      const isAvailable = await isPreviewAvailable(link);
      setPreviewAvailable(isAvailable);
      setIsLoading(false);
    };

    checkPreview();
  }, []);

  return (
    <div className={s.previewResult}>
      {isLoading ? (
        <>
          <EyeOutlined spin={true} style={{ color: 'white' }} />
          <span>Loading...</span>
        </>
      ) : previewAvailable ? (
        <>
          <EyeOutlined style={{ color: 'white' }} />
          {/* <span>Preview available</span> */}
        </>
      ) : (
        <>
          <EyeInvisibleOutlined style={{ color: 'gray' }} />
          {/* <span>Preview not available</span> */}
        </>
      )}
    </div>
    // <Spin spinning={isLoading}>
    //   {previewAvailable ? (
    //     <EyeOutlined spin={isLoading} style={{ color: 'red' }} />
    //   ) : (
    //     <EyeInvisibleOutlined style={{ color: 'red' }} />
    //   )}
    //   {/* <EyeInvisibleOutlined spin={isLoading} /> */}
    // </Spin>
  );
};
const MemoizedPreviewResult = memo(PreviewResult);

const isPreviewAvailable = async (url: string) => {
  const response = await fetch('http://localhost:3000/api/checkUrlPreview/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  }).then((res) => res.json());

  return response.available;
};

interface ArticlePreviewProps extends ArticleType {
  search?: string;
}

export const ArticlePreview = (props: ArticlePreviewProps) => {
  const { id, title, author, content, pubDate, isoDate, link } = props;
  const { status } = useFoundPostsStore();
  const { searchAuthor, searchTitle, loading } = status;
  const keyword = searchTitle || searchAuthor;

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
        <Link href={`/post/${id}`}>
          <MemoizedPreviewResult link={parseLink(content)} />
        </Link>
        <span className={s['author']}>{stripUsername(author)}</span>
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
