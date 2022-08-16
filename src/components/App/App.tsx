import { useEffect, useState } from 'react';
import { AppHeader } from '../AppHeader';
import { MainPage } from '../../views/MainPage';
import { TreeNode } from '../TreeView/utils';
import {
  loadDataFromFile,
  loadDataFromMocks,
} from '../../services/loadFromFile';
import styles from './App.module.scss';
import { saveToFile } from '../../services/saveToFile';
import { convertTreeToJSON } from '../../services/utils';

export const App = () => {
  const [data, setData] = useState<TreeNode<string>[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const loadedData = await loadDataFromMocks();
      setData(loadedData);
    };

    load();
  }, []);

  const handleSubmit = (data: TreeNode<string>[]) => {
    const json = convertTreeToJSON(data);
    saveToFile(json);
  };

  const handleLoad = async () => {
    try {
      const tree = await loadDataFromFile();
      setData(tree);
    } catch (error) {
      alert('Что-то пошло не так');
      console.error(error);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <main className={styles.main}>
        <h1 className="visually-hidden">Портфолио</h1>

        <div className={styles.container}>
          {data && (
            <MainPage data={data} onSubmit={handleSubmit} onLoad={handleLoad} />
          )}
        </div>
      </main>
    </div>
  );
};
