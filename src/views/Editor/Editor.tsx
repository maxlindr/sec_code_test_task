import { useState } from 'react';
import { TreeNode } from '../../components/TreeView/utils';
import { EditableItem } from './components/EditableItem';
import styles from './Editor.module.scss';

interface Props {
  data: TreeNode<string>;
  onChange(data: TreeNode<string>): void;
}

export const Editor = ({ data, onChange }: Props) => {
  const [editableID, setEditableID] = useState('');

  const handleSetEditable = (id: string, editable: boolean) => {
    if (editable) {
      setEditableID(id);
    } else {
      setEditableID('');
    }
  };

  const handleChange = (id: string, value: string) => {
    setEditableID('');

    const newTreeNode = { ...data };
    const changedNode = newTreeNode.children?.find((it) => it.id === id);

    if (changedNode) {
      changedNode.name = value;
      onChange(newTreeNode);
    }
  };

  return (
    <div className={styles.root}>
      {data.children?.map((it) => (
        <EditableItem
          key={it.id}
          data={it}
          onSetEditable={handleSetEditable}
          editable={editableID === it.id}
          readonly={editableID !== '' && editableID !== it.id}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};
