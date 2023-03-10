import { CaretLeftOutlined } from '@ant-design/icons';
import { gql, useQuery } from '@apollo/client';
import { stripUsername } from '@devit-test-project/library';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import Iframe from 'react-iframe';
import { HeadComponent } from '../../components/head/head';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import s from './[id].module.scss';

export const parseLink = (content: string) => {
  const links = content.split('<a');

  const parsedLinks = links.map((link) => {
    if (link.includes('href')) {
      const href = link.split('href="')[1].split('"')[0];
      const text = link.split('>')[1].split('<')[0];
      return {
        [text.replaceAll(' ', '')]: href,
      };
    }
    return link;
  });

  return parsedLinks[2]['[link]'];
};

const QUERY = (id: string) => gql`
query {
	getOnePost(
		input: {
		id: "${id}"
	}
	) {
	  id
	  pubDate
	  title
	  author
	  content
	  link
	  contentSnippet
	}
  }
`;

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(QUERY(`${id}`));

  if (loading || !data || !data.getOnePost) {
    return (
      <DefaultLayout>
        <HeadComponent title="Loading..." />
        <h2>Loading...</h2>
      </DefaultLayout>
    );
  }

  if (error) {
    console.error(error);
    return null;
  }

  const { title, content } = data.getOnePost;
  const injectHtml = stripUsername(
    content
      .replace('&#32; submitted by &#32; ', '')
      .replace(/<a href/g, '<a target="_blank" href')
  );
  return (
    <DefaultLayout>
      <HeadComponent title={title} />
      <Button
        block={false}
        icon={<CaretLeftOutlined />}
        type="primary"
        onClick={() => {
          router.push('/');
        }}
      >
        Back
      </Button>
      <h1>{title}</h1>
      <div
        className={s['links']}
        dangerouslySetInnerHTML={{ __html: injectHtml }}
      ></div>

      <Iframe
        url={parseLink(injectHtml)}
        width="100%"
        height="400px"
        id=""
        className=""
        display="block"
        position="relative"
      />
    </DefaultLayout>
  );
}
