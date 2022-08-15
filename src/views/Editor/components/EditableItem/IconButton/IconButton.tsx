import { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import { ReactComponent as CloseIcon } from './close_black_24dp.svg';
import { ReactComponent as DeleteIcon } from './delete_black_24dp.svg';
import { ReactComponent as OkIcon } from './done_black_24dp.svg';
import { ReactComponent as EditIcon } from './edit_black_24dp.svg';

import styles from './IconButton.module.scss';

type IconType = 'ok' | 'edit' | 'cancel' | 'delete';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: IconType;
}

const icons: Record<IconType, ReactNode> = {
  ok: <OkIcon />,
  cancel: <CloseIcon />,
  edit: <EditIcon />,
  delete: <DeleteIcon />,
};

export const IconButton = ({ variant, className, ...props }: Props) => {
  return (
    <button {...props} className={cn(className, styles.root)}>
      {icons[variant]}
    </button>
  );
};
