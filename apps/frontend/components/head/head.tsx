import styles from './head.module.scss';
import Head from 'next/head';

/* eslint-disable-next-line */
export interface HeadProps {}

export const HeadComponent = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>RSS Parser | {title}</title>
    </Head>
  );
};
