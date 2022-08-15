import { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { TreeNode } from '../../../../components/TreeView/utils';
import cn from 'classnames';
import styles from './EditableItem.module.scss';
import { IconButton } from './IconButton';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

interface Props<T extends string> {
  data: TreeNode<T>;
  editable?: boolean;
  readonly: boolean;
  onSetEditable?: (id: string, editable: boolean) => void;
  onChange(id: string, value: string): void;
}

export function EditableItem<T extends string>({
  data,
  onSetEditable = noop,
  readonly,
  editable,
  onChange,
}: Props<T>) {
  const { name, id } = data;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [value, setValue] = useState(name);

  const handleInputChange = (evt) => {
    setValue(evt.target.value);
  };

  const handleMouseEnter = () => {
    if (!readonly) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const cancelEditable = useCallback(() => {
    setValue(name);
    onSetEditable(id, false);
  }, [id, name, onSetEditable]);

  useKeyPressEvent('Escape', () => {
    if (editable) {
      cancelEditable();
    }
  });

  const handleEditBtnClick = () => {
    onSetEditable(id, true);
  };

  const handleOKBtnCkick = () => {
    onChange(id, value);
    onSetEditable(id, false);
  };

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [editable]);

  return (
    <div
      ref={rootRef}
      className={cn(styles.root, (editable || hovered) && styles.rootEditable)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className={cn(styles.staticText, editable && styles.hidden)}>{name}</p>

      {editable && (
        <input
          ref={inputRef}
          className={styles.textInput}
          type="text"
          value={value}
          onChange={handleInputChange}
        />
      )}

      <div className={styles.controls}>
        {!editable && !readonly && (
          <IconButton
            variant="edit"
            onClick={handleEditBtnClick}
            aria-label="Edit"
            className={styles.editBtn}
          />
        )}

        {editable && (
          <>
            <IconButton
              variant="ok"
              onClick={handleOKBtnCkick}
              aria-label="OK"
            />
            <IconButton
              variant="cancel"
              onClick={cancelEditable}
              aria-label="Cancel"
            />
          </>
        )}
      </div>
    </div>
  );
}
