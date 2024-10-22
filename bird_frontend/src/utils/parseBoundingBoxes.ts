// src/utils/parseBoundingBoxes.ts

import { GCS_BASE_URL } from './constants';

export interface BoundingBox {
  imageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const parseBoundingBoxes = async (): Promise<Record<string, BoundingBox>> => {
  try {
    const response = await fetch(`${GCS_BASE_URL}/bounding_boxes.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bounding_boxes.txt: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const boundingBoxes: Record<string, BoundingBox> = {};

    lines.forEach((line) => {
      const [imageId, x, y, width, height] = line.trim().split(/\s+/);
      boundingBoxes[imageId] = {
        imageId,
        x: parseFloat(x),
        y: parseFloat(y),
        width: parseFloat(width),
        height: parseFloat(height),
      };
    });

    return boundingBoxes;
  } catch (error) {
    console.error('Error in parseBoundingBoxes:', error);
    return {};
  }
};
