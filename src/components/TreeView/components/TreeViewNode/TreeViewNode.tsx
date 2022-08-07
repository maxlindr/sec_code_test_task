import { KeyboardEventHandler, ReactNode, useRef } from 'react';
import cn from 'classnames';
import styles from './TreeViewNode.module.scss';
import { Collapse } from '../../../Collapse';
import {
  findNextFocusableTreeItem,
  findPrevFocusableTreeItem,
  findTreeItemControl,
} from '../../utils';

interface Props<T extends string | number> {
  className?: string;
  id: T;
  title: string;
  expanded: boolean;
  children: ReactNode;
  onToggle(id: T, value: boolean): void;
  onKeyDown?: (id: T, key: string) => void;
  disabled?: boolean;
  onSelect(id: T): void;
}

export const TreeViewNode = <T extends string | number>({
  className,
  children,
  title,
  expanded,
  id,
  onToggle,
  onKeyDown,
  disabled = false,
  onSelect,
}: Props<T>) => {
  const rootRef = useRef<HTMLLIElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleToggle = () => {
    onToggle(id, !expanded);
  };

  const handleFocus = () => {
    onSelect(id);
  };

  const handleBtnKeyPress: KeyboardEventHandler<HTMLButtonElement> = (evt) => {
    const root = rootRef.current;
    if (!root) return;
    const key = evt.key;
    onKeyDown && onKeyDown(id, key);

    switch (key) {
      case 'ArrowRight':
        if (!expanded) {
          onToggle(id, true);
        } else {
          const inputsNodeList = listRef.current?.querySelectorAll('input');
          const inputs = inputsNodeList && Array.from(inputsNodeList);
          const firstEnabledInput = inputs?.find((input) => !input.disabled);
          firstEnabledInput?.focus();
        }
        break;

      case 'ArrowLeft':
        if (expanded) onToggle(id, false);
        break;

      case 'ArrowUp': {
        const focusableItemRoot = findPrevFocusableTreeItem(root);

        if (focusableItemRoot) {
          findTreeItemControl(focusableItemRoot)?.focus();
        }

        break;
      }

      case 'ArrowDown': {
        const focusableItemRoot = findNextFocusableTreeItem(root);

        if (focusableItemRoot) {
          findTreeItemControl(focusableItemRoot)?.focus();
        }

        break;
      }
    }
  };

  return (
    <li
      ref={rootRef}
      className={className}
      role="treeitem"
      aria-expanded={expanded}
      data-disabled={disabled}
    >
      <button
        type="button"
        className={cn(styles.control, expanded && styles.controlExpanded)}
        onClick={handleToggle}
        onKeyDown={handleBtnKeyPress}
        onFocus={handleFocus}
      >
        {title}
      </button>

      <Collapse expanded={expanded}>
        <ul ref={listRef} className={styles.list} role="group">
          {children}
        </ul>
      </Collapse>
    </li>
  );
};
