import { TreeNode } from '../components/TreeView/utils';
import { clone, findNodeById } from '../utils';

const convertRawTreeToTreeNodes = (data: TreeNode<string>[]) => {
  data.forEach((rawNode) => {
    const children = rawNode.children;

    if (children) {
      children.forEach((it) => {
        it.parent = rawNode;
      });

      convertRawTreeToTreeNodes(children);
    }
  });
};

interface FlattenTreeNode<T extends string | number> {
  id: T;
  name: string;
  parent?: T;
  children?: T[];
}

const flattenTree = (
  data: TreeNode<string>[],
  result: FlattenTreeNode<string>[]
) => {
  data.forEach((node) => {
    const { parent, children, ...rest } = node;

    const newNode = {
      ...rest,
      parent: parent?.id,
      children: children?.map((it) => it.id),
    };

    if (!newNode.parent) {
      delete newNode.parent;
    }

    if (!newNode.children) {
      delete newNode.children;
    }

    result.push(newNode);

    if (children) {
      flattenTree(children, result);
    }
  });
};

export const convertFlatToTree = (arr: FlattenTreeNode<string>[]) => {
  const tree: TreeNode<string>[] = [];

  arr.forEach((it) => {
    if (!it.parent) {
      tree.push(it as TreeNode<string>);
      return;
    }

    const parent = findNodeById(it.parent ?? '', tree);

    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push({
        id: it.id,
        name: it.name,
        parent,
      });

      parent.children = parent.children.filter((it) => typeof it !== 'string');
    }
  });

  return tree;
};

const convertTreeNodesToRawTree = (
  data: TreeNode<string>[],
  copy: TreeNode<string>[]
) => {
  data.forEach((node) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parent, ...rest } = node;
    const newNode = { ...rest };

    copy.push(newNode);

    const children = node.children;

    if (children) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      convertTreeNodesToRawTree(children, copy);
    }
  });
};

export const convertRawToTreeNode = (data: unknown) => {
  const clonedData = clone(data) as TreeNode<string>[];
  convertRawTreeToTreeNodes(clonedData);
  return clonedData;
};

export const convertTreeToJSON = (tree: TreeNode<string>[]) => {
  const result = [];
  flattenTree(tree, result);

  return JSON.stringify(result);
};
