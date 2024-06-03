export interface Size {
  width: number;
  height: number;
}

export const calculateSize = (oldWidth: number, oldHeight: number, targetSize: number): Size => {
  const aspectRatio: number = oldWidth / oldHeight;

  let newWidth: number, newHeight: number;
  if (aspectRatio >= 1) {
    newWidth = targetSize;
    newHeight = targetSize / aspectRatio;
  } else {
    newHeight = targetSize;
    newWidth = targetSize * aspectRatio;
  }

  return { width: newWidth, height: newHeight };
};
