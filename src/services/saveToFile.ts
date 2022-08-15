export const saveToFile = (data: string) => {
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(
    new Blob([data], { type: 'text/plain' })
  );

  link.download = 'demo.json';
  link.click();
};
