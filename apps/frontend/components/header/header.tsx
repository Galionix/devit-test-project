import LoginButton from '../login-button/login-button';
import Link from 'next/link';
import styles from './header.module.scss';

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  return (
    <nav className={styles['container']}>
      <Link href="/">
        <h3>Home</h3>
      </Link>
      <Link href="/admin">
        <h3>Admin</h3>
      </Link>
    </nav>
  );
}

export default Header;
