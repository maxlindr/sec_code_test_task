import cn from 'classnames';
import styles from './Tab.module.scss';

interface Props {
  id: string;
  label: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export const Tab = ({ id, label, selected, onClick }: Props) => {
  return (
    <button
      key={id}
      value={id}
      onClick={() => onClick(id)}
      className={cn(styles.tab, selected && styles.tabSelected)}
    >
      {label}
    </button>
  );
};
