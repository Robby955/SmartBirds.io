// src/utils/parseAttributes.ts

export interface Attribute {
  name: string;
  isPresent: boolean;
  certainty: number; // Value between 1 and 4
}

export const parseAttributes = async (): Promise<Record<string, Attribute[]>> => {
  try {
    // Fetch the attribute names from cloud storage
    const attributeNamesResponse = await fetch('https://storage.googleapis.com/smartbirds-assets/attributes.txt');
    if (!attributeNamesResponse.ok) {
      throw new Error('Failed to fetch attributes names.');
    }
    const attributeNamesText = await attributeNamesResponse.text();
    const attributeNamesLines = attributeNamesText.split('\n').filter(line => line.trim() !== '');

    // Parse the attribute names
    const attributeNames: Record<string, string> = {};
    attributeNamesLines.forEach(line => {
      const parts = line.split(/\s+/, 2); // Split into two parts
      if (parts.length < 2) {
        console.warn(`Malformed attribute line: "${line}"`);
        return; // Skip malformed lines
      }
      const [attributeId, attributeName] = parts;
      if (!attributeId || !attributeName) {
        console.warn(`Incomplete attribute data in line: "${line}"`);
        return;
      }
      // Remove any trailing commas and replace '::' with spaces for readability
      attributeNames[attributeId] = attributeName.trim().replace(/::/g, ' ');
    });

    // Fetch the image-specific attribute labels from cloud storage
    const imageAttributeLabelsResponse = await fetch('https://storage.googleapis.com/smartbirds-assets/image_attribute_labels.txt');
    if (!imageAttributeLabelsResponse.ok) {
      throw new Error('Failed to fetch image attribute labels.');
    }
    const imageAttributeLabelsText = await imageAttributeLabelsResponse.text();
    const imageAttributeLabelsLines = imageAttributeLabelsText.split('\n').filter(line => line.trim() !== '');

    const attributesRecord: Record<string, Attribute[]> = {};

    imageAttributeLabelsLines.forEach(line => {
      const parts = line.split(/\s+/);
      if (parts.length < 4) { // Expecting at least four parts: imageId, attributeId, isPresent, certainty
        console.warn(`Malformed image attribute label line: "${line}"`);
        return; // Skip malformed lines
      }

      const [imageId, attributeId, isPresentStr, certaintyStr] = parts;
      const isPresent = isPresentStr === '1';
      const certainty = parseInt(certaintyStr, 10);

      if (!imageId || !attributeId || isNaN(certainty)) {
        console.warn(`Incomplete or invalid data in line: "${line}"`);
        return;
      }

      if (!attributesRecord[imageId]) {
        attributesRecord[imageId] = [];
      }

      // Look up the attribute name
      const attributeName = attributeNames[attributeId];
      if (attributeName) {
        attributesRecord[imageId].push({
          name: attributeName,
          isPresent,
          certainty,
        });
      } else {
        console.warn(`Attribute ID "${attributeId}" not found in attributes names.`);
      }
    });

    return attributesRecord;
  } catch (error) {
    console.error('Error parsing attributes data:', error);
    return {};
  }
};
