import { TreeNode } from './components/TreeView/utils';

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const removeElementByIndex = <T>(index: number, items: T[]) => {
  const newItems = items.slice();
  newItems.splice(index, 1);
  return newItems;
};

type ID = number | string;

const removeElementById = <T extends { id: ID }>(id: T['id'], items: T[]) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  return removeElementByIndex(index, items);
};

export const findNodeById = <T extends string | number>(
  id: T,
  nodes: TreeNode<T>[]
): TreeNode<T> | null => {
  for (const node of nodes) {
    if (node.id === id) return node;

    if (node.children && node.children.length) {
      const finded = findNodeById(id, node.children);
      if (finded) return finded;
    }
  }

  return null;
};
