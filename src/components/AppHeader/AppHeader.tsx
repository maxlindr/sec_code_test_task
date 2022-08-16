import logo from './logo.svg';
import styles from './AppHeader.module.scss';

export const AppHeader = () => {
  return (
    <header className={styles.appHeader}>
      <img src={logo} className={styles.appLogo} alt="logo" />

      <a
        className={styles.appLink}
        href="https://github.com/maxlindr/sec_code_test_task"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sources on GitHub
      </a>
    </header>
  );
};
