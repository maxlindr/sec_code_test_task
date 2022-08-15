import { mocks } from './mocks';
import { convertFlatToTree, convertRawToTreeNode } from './utils';

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsText(file);
  });
};

const getFileDescriptor = (): Promise<File> => {
  return new Promise((resolve) => {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', '.json');

    fileInput.addEventListener('change', async (evt) => {
      const fileList = (evt.target as EventTarget & HTMLInputElement)
        .files as FileList;
      resolve(fileList && fileList[0]);
    });

    fileInput.click();
  });
};

export const loadDataFromFile = async () => {
  const fileDescriptor = await getFileDescriptor();
  const json = await readFile(fileDescriptor);
  const rawData = JSON.parse(json);
  const tree = convertFlatToTree(rawData);
  return tree;
};

export const loadDataFromMocks = async () => {
  return convertRawToTreeNode(mocks);
};
