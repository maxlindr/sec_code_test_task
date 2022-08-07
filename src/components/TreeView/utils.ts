// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export interface TreeNode<T extends string | number> {
  id: T;
  name: string;
  parent?: TreeNode<T>;
  children?: TreeNode<T>[];
}

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

export const recalculateIds = <T extends string | number>(
  idCollection: T[],
  id: T,
  include: boolean
) => {
  const set = new Set(idCollection);

  if (include) {
    set.add(id);
  } else {
    set.delete(id);
  }

  return Array.from(set.values());
};

export enum TreeItemType {
  Node = 'node',
  Leaf = 'leaf',
  None = 'not item',
}

export const findPrevSiblings = (element: HTMLElement) => {
  const siblings: Element[] = [];
  let prev = element.previousElementSibling;

  while (prev) {
    siblings.push(prev);
    prev = prev.previousElementSibling;
  }

  return siblings as HTMLElement[];
};

export const findNextSiblings = (element: HTMLElement) => {
  const siblings: Element[] = [];
  let next = element.nextElementSibling;

  while (next) {
    siblings.push(next);
    next = next.nextElementSibling;
  }

  return siblings as HTMLElement[];
};

type ElementMatcher = (element: Element) => boolean;

const findParentElement = (
  element: HTMLElement,
  matcher?: ElementMatcher
): HTMLElement | null => {
  const parent = element.parentElement;
  if (!parent || parent.getAttribute('role') === 'tree') return null;
  if (!matcher) return parent;

  const isMatched = matcher(parent);
  if (isMatched) return parent;

  return findParentElement(parent, matcher);
};

export const getTreeItemType = (treeItem: Element) => {
  if (treeItem.getAttribute('role') !== 'treeitem') return TreeItemType.None;

  if (
    treeItem.getAttribute('role') === 'treeitem' &&
    treeItem.getAttribute('aria-expanded') != undefined
  ) {
    return TreeItemType.Node;
  }

  return TreeItemType.Leaf;
};

export const findTreeViewNodeControl = (treeViewNodeRoot: Element) =>
  treeViewNodeRoot.querySelector('button');

export const findTreeViewLeafControl = (treeViewLeafRoot: Element) => {
  const element = treeViewLeafRoot.querySelector('button[data-leaf="true"]');
  return element ? (element as HTMLInputElement) : null;
};

export const findTreeItemControl = (treeItem: Element) => {
  const type = getTreeItemType(treeItem);

  switch (type) {
    case TreeItemType.Node:
      return findTreeViewNodeControl(treeItem);
    case TreeItemType.Leaf: {
      return findTreeViewLeafControl(treeItem);
    }
  }

  return null;
};

export const findParentTreeViewNode = (element: HTMLElement) => {
  return findParentElement(element, (el) => {
    return getTreeItemType(el) === TreeItemType.Node;
  });
};

export const findTreeRoot = (element: HTMLElement): HTMLElement | null => {
  const parent = element.parentElement;
  if (!parent) return null;
  if (parent.getAttribute('role') === 'tree') return parent;

  return findTreeRoot(parent);
};

const traverseNode = (
  element: Element,
  callback: (element: Element) => void,
  skipChildren: (element: Element) => boolean = () => false
) => {
  callback(element);
  const children = element.children;

  if (children.length) {
    if (skipChildren(element)) return;

    Array.from(children).forEach((element) => {
      traverseNode(element, callback);
    });
  }
};

const checkTreeViewNodeExpanded = (element: Element) =>
  element.getAttribute('aria-expanded') === 'true';

const checkTreeItemDisabled = (element: HTMLElement) =>
  element.dataset.disabled === 'true';

const getFlattenFocusableTreeItems = (treeItem: HTMLElement) => {
  const treeRoot = findTreeRoot(treeItem);
  if (!treeRoot) return [];

  const rootNodes = Array.from(treeRoot.children);
  const treeItems: Element[] = [];

  const filterTreeItem = (element: Element) => {
    const type = getTreeItemType(element);

    return (
      (type === TreeItemType.Node || type === TreeItemType.Leaf) &&
      !checkTreeItemDisabled(element as HTMLElement)
    );
  };

  const skipChildren = (element: Element) => {
    return (
      getTreeItemType(element) === TreeItemType.Node &&
      !checkTreeViewNodeExpanded(element)
    );
  };

  const processCurrentElement = (element: Element) => {
    if (filterTreeItem(element)) {
      treeItems.push(element);
    }
  };

  rootNodes.forEach((it) =>
    traverseNode(it, processCurrentElement, skipChildren)
  );

  return treeItems;
};

export const findPrevFocusableTreeItem = (treeItem: HTMLElement) => {
  const flattenedTreeItems = getFlattenFocusableTreeItems(treeItem);

  const currentItemIndex = flattenedTreeItems.findIndex(
    (it) => it === treeItem
  );

  if (currentItemIndex === -1) return null;
  const prevTreeItems = flattenedTreeItems.slice(0, currentItemIndex);

  if (prevTreeItems.length) {
    return prevTreeItems[prevTreeItems.length - 1];
  }

  return null;
};

export const findNextFocusableTreeItem = (treeItem: HTMLElement) => {
  const flattenedTreeItems = getFlattenFocusableTreeItems(treeItem);

  const currentItemIndex = flattenedTreeItems.findIndex(
    (it) => it === treeItem
  );

  if (currentItemIndex === -1) return null;
  const nextTreeItems = flattenedTreeItems.slice(currentItemIndex + 1);

  if (nextTreeItems.length) {
    return nextTreeItems[0];
  }

  return null;
};
