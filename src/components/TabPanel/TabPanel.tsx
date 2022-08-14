import { ReactNode } from 'react';
import styles from './TabPanel.module.scss';

interface Props {
  selected: boolean;
  children: ReactNode;
}

export const TabPanel = ({ selected, children }: Props) => {
  return <div className={selected ? undefined : styles.hidden}>{children}</div>;
};
