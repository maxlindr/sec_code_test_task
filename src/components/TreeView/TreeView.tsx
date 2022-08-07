import { useState } from 'react';
import { TreeNode, noop, recalculateIds } from './utils';
import { nonNullable } from '../../utils';

import styles from './TreeView.module.scss';
import { TreeViewLeaf } from './components/TreeViewLeaf/TreeViewLeaf';
import { TreeViewNode } from './components/TreeViewNode';

const DEFAULT_DROPBOX_HEIGHT = 'auto';

interface Props<T extends string | number> {
  data?: TreeNode<T>[];
  className?: string;
  selected?: T[];
  onChange?: (selected: T) => void;
  filter?: (node: TreeNode<T>) => boolean;
  disabledNode?: (node: TreeNode<T>) => boolean;
  dropboxHeight?: number | string;
}

const TreeView = <T extends string | number>({
  data = [],
  selected = [],
  className,
  dropboxHeight = DEFAULT_DROPBOX_HEIGHT,
  onChange = noop,
  filter = () => true,
  disabledNode = () => false,
}: Props<T>) => {
  const [expanded, setExpanded] = useState<T[]>([]);

  const handleNodeToggle = (id: T, nodeExpanded: boolean) => {
    setExpanded(recalculateIds(expanded, id, nodeExpanded));
  };

  const mapDataToTreeNodes = (nodes: TreeNode<T>[]) => {
    return nodes.map((node) => {
      if (node.children && node.children.length) {
        const matchedChildrens = node.children.filter(filter);

        if (matchedChildrens.length) {
          return (
            <TreeViewNode
              key={node.id}
              id={node.id}
              onToggle={handleNodeToggle}
              title={node.name}
              expanded={expanded.includes(node.id)}
              onSelect={(id) => onChange(id)}
            >
              {mapDataToTreeNodes(matchedChildrens)}
            </TreeViewNode>
          );
        }

        return null;
      }

      if (filter(node)) {
        return (
          <TreeViewLeaf
            key={node.id}
            id={node.id}
            className={styles.leaf}
            checked={selected.includes(node.id)}
            label={node.name}
            disabled={disabledNode(node)}
          />
        );
      }

      return null;
    });
  };

  const items = mapDataToTreeNodes(data).filter(nonNullable);

  return (
    <div className={className}>
      <div className={styles.scrollbox} style={{ maxHeight: dropboxHeight }}>
        {items.length > 0 ? (
          <ul className={styles.container} role="tree">
            {items}
          </ul>
        ) : (
          <p className={styles.noItems}>no items</p>
        )}
      </div>
    </div>
  );
};

export default TreeView;
