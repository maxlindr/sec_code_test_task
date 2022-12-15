import { TreeNode } from './components/TreeView/utils';

type ID = number | string;

interface Item {
  id: ID;
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const removeElementByIndex = <T>(index: number, items: T[]) => {
  const newItems = items.slice();
  newItems.splice(index, 1);
  return newItems;
};

export const removeElementById = <T extends Item>(id: T['id'], items: T[]) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  return removeElementByIndex(index, items);
};

export const replaceElement = <T extends Item>(element: T, items: T[]) => {
  const index = items.findIndex((item) => item.id === element.id);
  if (index === -1) return items;
  const newItems = items.slice();
  newItems.splice(index, 1, element);
  return newItems;
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

export const replaceNode = <T extends string | number>(
  node: TreeNode<T>,
  tree: TreeNode<T>[]
) => {
  const newTree = tree.slice();
  const id = node.id;
  const findedNode = findNodeById(id, newTree);

  if (!findedNode) return tree;

  const parent = findedNode?.parent;

  if (parent && parent.children) {
    parent.children = replaceElement(node, parent.children);
    return newTree;
  }

  return replaceElement(node, newTree);
};
