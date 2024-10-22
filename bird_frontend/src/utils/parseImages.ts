// src/utils/parseImages.ts

import { GCS_BASE_URL } from './constants';

export const parseImages = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${GCS_BASE_URL}/images.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch images.txt: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const imageMap: Record<string, string> = {};

    lines.forEach((line) => {
      const [imageId, imagePath] = line.trim().split(/\s+/, 2); // Split on first whitespace
      if (!imageId || !imagePath) {
        console.error(`Invalid line in images.txt: ${line}`);
        return;
      }
      imageMap[imageId] = imagePath;
    });

    return imageMap;
  } catch (error) {
    console.error('Error in parseImages:', error);
    return {};
  }
};
