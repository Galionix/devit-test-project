import Link from 'next/link';
import styles from './footer.module.scss';

/* eslint-disable-next-line */
export interface FooterProps {}

export function Footer(props: FooterProps) {
  return (
    <div className={styles['container']}>
      <aside>
        <Link href="/">
          <h3>Fullstack app for devit</h3>
        </Link>
      </aside>
		  <Link href="https://thedimas.com"
		  target="blank"
		  >
        <h3>made by Galionix</h3>
      </Link>

      <code>
        Codename: <mark>RSS viewer</mark>
      </code>
    </div>
  );
}

export default Footer;
