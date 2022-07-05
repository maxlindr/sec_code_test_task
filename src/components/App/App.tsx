import { AppHeader } from '../AppHeader';
import styles from './App.module.scss';

export const App = () => {
  return (
    <div className={styles.app}>
      <AppHeader />

      <main className={styles.main}>
        <h1 className="visually-hidden">Портфолио</h1>

        <div className={styles.container}>

        </div>
      </main>
    </div>
  );
};
