/* global MINDAR */

import { message } from "antd";

const generateMindFile = async (images, onProgress) => {
  if (typeof window.MINDAR === "undefined") {
    message.error("MINDAR library is not loaded.");
    return null;
  }

  if (!window.MINDAR.IMAGE || !window.MINDAR.IMAGE.Compiler) {
    message.error("MINDAR.IMAGE.Compiler is not available.");
    return null;
  }

  const compiler = new MINDAR.IMAGE.Compiler();

  const loadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const fileToLoad = file.originFileObj || file;
      if (!(fileToLoad instanceof File)) {
        reject(new Error('Invalid file type.'));
        return;
      }
  
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(fileToLoad);
    });
  };
  

  const loadedImages = [];
  for (let i = 0; i < images.length; i++) {
    loadedImages.push(await loadImage(images[i]));
  }

  await compiler.compileImageTargets(
    loadedImages,
    (progress) => {
      const roundedProgress = Math.round(progress);
      if (onProgress) {
        onProgress(roundedProgress);
      }
    }
  );

  const exportedBuffer = await compiler.exportData();
  const mindFile = new Blob([exportedBuffer], {
    type: "application/octet-stream",
  });
  return mindFile;
};

export default generateMindFile;
