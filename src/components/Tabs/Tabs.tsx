import { ReactNode } from 'react';
import styles from './Tabs.module.scss';

interface Props {
  children: ReactNode[];
}

export const Tabs = ({ children = [] }: Props) => {
  return <div className={styles.tabs}>{children}</div>;
};
