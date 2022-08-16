import { useEffect, useState } from 'react';
import cn from 'classnames';
import { noop } from './utils';
import { findNodeById, replaceNode } from '../../utils';

import { Tab } from '../../components/Tab';
import { TabPanel } from '../../components/TabPanel';
import { Tabs } from '../../components/Tabs';
import TreeView from '../../components/TreeView';
import { TreeNode } from '../../components/TreeView/utils';
import { Editor } from '../Editor';

import styles from './MainPage.module.scss';

interface Props {
  data: TreeNode<string>[];
  onSubmit?: (data: TreeNode<string>[]) => void;
  onLoad?: () => void;
}

export const MainPage = ({ data, onSubmit = noop, onLoad = noop }: Props) => {
  const [nodes, setNodes] = useState<TreeNode<string>[]>([]);
  const [selectedID, setSelectedID] = useState('');
  const [selectedTabID, setSelectedTabID] = useState('');
  const [renderableNodes, setRenderableNodes] = useState<TreeNode<string>[]>(
    []
  );

  useEffect(() => {
    setNodes(data);
    setSelectedID('');
    setSelectedTabID('');
  }, [data]);

  useEffect(() => {
    const selectedNode = findNodeById(selectedID, nodes);

    if (!selectedNode) {
      return;
    }

    const isSelectedNodeHasChildren =
      selectedNode && selectedNode.children && selectedNode.children.length > 0;

    const isSelectedNodeTerminal =
      isSelectedNodeHasChildren &&
      selectedNode.children?.every((node) => !node.children);

    const renderableNodes = isSelectedNodeTerminal
      ? [selectedNode]
      : selectedNode?.children ?? [];

    setRenderableNodes(renderableNodes);

    if (renderableNodes.length > 0) {
      setSelectedTabID(renderableNodes[0].id);
    }
  }, [nodes, selectedID]);

  const handleNodeChange = (node: TreeNode<string>) => {
    const newTree = replaceNode(node, data);
    setNodes(newTree);
  };

  return (
    <div className={styles.root}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <TreeView
            dropboxHeight="100%"
            data={nodes}
            className={styles.treeView}
            onChange={setSelectedID}
          />
        </div>

        <div className={styles.column}>
          {renderableNodes.length > 0 && (
            <>
              <Tabs>
                {renderableNodes.map((node) => (
                  <Tab
                    key={node.id}
                    id={node.id}
                    label={node.name}
                    onClick={setSelectedTabID}
                    selected={node.id === selectedTabID}
                  />
                ))}
              </Tabs>

              {renderableNodes.map((node) => (
                <TabPanel key={node.id} selected={node.id === selectedTabID}>
                  <Editor data={node} onChange={handleNodeChange} />
                </TabPanel>
              ))}
            </>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <button
          className={cn('button', styles.footerButton)}
          onClick={() => onSubmit(nodes)}
        >
          Сохранить
        </button>

        <button
          className={cn('button', styles.footerButton)}
          onClick={() => onLoad()}
        >
          Загрузить
        </button>
      </footer>
    </div>
  );
};
