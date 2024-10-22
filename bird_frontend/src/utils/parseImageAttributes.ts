// src/utils/parseImageAttributes.ts

import { GCS_BASE_URL } from './constants';

export interface ImageAttribute {
  imageId: string;
  attributeId: string;
  isPresent: boolean;
  certaintyId: string;
  time: string;
}

export const parseImageAttributes = async (): Promise<Record<string, ImageAttribute[]>> => {
  try {
    const response = await fetch(`${GCS_BASE_URL}/image_attribute_labels.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image_attribute_labels.txt: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const imageAttributes: Record<string, ImageAttribute[]> = {};

    lines.forEach((line) => {
      const [imageId, attributeId, isPresent, certaintyId, time] = line.trim().split(' ');
      if (!imageAttributes[imageId]) {
        imageAttributes[imageId] = [];
      }
      imageAttributes[imageId].push({
        imageId,
        attributeId,
        isPresent: isPresent === '1',
        certaintyId,
        time,
      });
    });

    return imageAttributes;
  } catch (error) {
    console.error('Error in parseImageAttributes:', error);
    return {};
  }
};
