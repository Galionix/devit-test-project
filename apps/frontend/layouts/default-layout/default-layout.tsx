import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import styles from './default-layout.module.scss';

export interface DefaultLayoutProps {
  children: JSX.Element[] | JSX.Element;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Header />
      <section className={styles['container']}>{children}</section>
      <Footer />
    </>
  );
}

export default DefaultLayout;
