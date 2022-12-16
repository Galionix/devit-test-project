import { gql, useQuery } from '@apollo/client';
import { ArticleType, stripUsername } from '@devit-test-project/library';
import client from '../../apollo-client';
import { useRouter } from 'next/router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import DefaultLayout from '../../layouts/default-layout/default-layout';
import s from './[id].module.scss';
import Iframe from 'react-iframe';

export const parseLink = (content: string) => {
  // const highlightedLinks = content.replaceAll('<a', `
  // <a`);

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
  // { post }: { post: ArticleType }
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(QUERY(`${id}`));

  if (loading || !data || !data.getOnePost) {
    return (
      <DefaultLayout>
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
