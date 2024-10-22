// src/utils/parseImageClassLabels.ts

import { GCS_BASE_URL } from './constants';

export const parseImageClassLabels = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${GCS_BASE_URL}/image_class_labels.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image_class_labels.txt: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const imageClassMap: Record<string, string> = {};

    lines.forEach((line) => {
      const [imageId, classId] = line.trim().split(/\s+/, 2);
      if (!imageId || !classId) {
        console.error(`Invalid line in image_class_labels.txt: ${line}`);
        return;
      }
      imageClassMap[imageId] = classId;
    });

    return imageClassMap;
  } catch (error) {
    console.error('Error in parseImageClassLabels:', error);
    return {};
  }
};
