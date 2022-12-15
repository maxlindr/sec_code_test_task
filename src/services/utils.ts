import { TreeNode } from '../components/TreeView/utils';
import { MockTreeNode } from './mocks';

interface FlattenTreeNode<T extends string | number> {
  id: T;
  name: string;
  children?: T[];
}

const flattenTree = (
  data: TreeNode<string>[],
  result: FlattenTreeNode<string>[]
) => {
  data.forEach((node) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parent, children, ...rest } = node;

    const newNode: FlattenTreeNode<string> = {
      ...rest,
    };

    if (children) newNode.children = children.map((it) => it.id);

    result.push(newNode);

    if (children) {
      flattenTree(children, result);
    }
  });
};

export const convertFlatToTree = (arr: FlattenTreeNode<string>[]) => {
  const nodes = new Map<string, TreeNode<string>>();

  arr.forEach(({ id, name }) => {
    nodes.set(id, {
      id,
      name,
    });
  });

  arr.forEach((it) => {
    const { id, children } = it;

    if (!children) return;

    const node = nodes.get(id);

    if (!node) return;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const findNode = (id: string) => nodes.get(id)!;

    const nodeChildren = children.map(findNode);
    nodeChildren.forEach((it) => (it.parent = node));
    node.children = nodeChildren;
  });

  return Array.from(nodes.values()).filter((node) => !node.parent);
};

export const convertMockToTreeNode = <T extends string | number>(
  mock: MockTreeNode<T>[]
) => {
  const cloneTreeNode = (root: MockTreeNode<T>, parent?: TreeNode<T>) => {
    const rootClone: TreeNode<T> = {
      id: root.id,
      name: root.name,
    };

    if (parent) rootClone.parent = parent;

    if (root.children) {
      rootClone.children = root.children.map((child) =>
        cloneTreeNode(child, rootClone)
      );
    }

    return rootClone;
  };

  const result = mock.map((node) => cloneTreeNode(node));

  return result;
};

export const convertTreeToJSON = (tree: TreeNode<string>[]) => {
  const result = [];
  flattenTree(tree, result);

  return JSON.stringify(result);
};
