// src/utils/parseParts.ts

export interface Part {
    partId: string;
    partName: string;
    x: number;
    y: number;
    visible: boolean;
  }
  
  export type PartsData = Record<string, Part[]>;
  
  /**
   * Parses part names and their locations from cloud storage.
   * Handles part names with multiple words.
   *
   * @returns A promise that resolves to a PartsData object mapping image IDs to their parts.
   */
  export const parseParts = async (): Promise<PartsData> => {
    try {
      // -----------------------------
      // Step 1: Fetch and Parse Part Names
      // -----------------------------
  
      // Fetch the part names from cloud storage
      const partNamesResponse = await fetch('https://storage.googleapis.com/smartbirds-assets/parts/parts.txt');
      if (!partNamesResponse.ok) {
        throw new Error('Failed to fetch parts names.');
      }
      const partNamesText = await partNamesResponse.text();
  
      // Split the text into lines and filter out empty lines
      const partNamesLines = partNamesText.split('\n').filter(line => line.trim() !== '');
  
      // Initialize a record to hold part ID to part name mapping
      const partNames: Record<string, string> = {};
  
      // Use regex to accurately split each line into part ID and part name
      partNamesLines.forEach(line => {
        // Match lines with format: <part_id> <part_name>
        const match = line.match(/^(\d+)\s+(.*)$/);
        if (!match) {
          console.warn(`Malformed part name line: "${line}"`);
          return; // Skip malformed lines
        }
  
        const [, partId, partName] = match;
  
        if (!partId || !partName) {
          console.warn(`Incomplete part name data in line: "${line}"`);
          return;
        }
  
        partNames[partId] = partName.trim();
      });
  
      // -----------------------------
      // Step 2: Fetch and Parse Part Locations
      // -----------------------------
  
      // Fetch the part locations from cloud storage
      const partLocsResponse = await fetch('https://storage.googleapis.com/smartbirds-assets/parts/part_locs.txt');
      if (!partLocsResponse.ok) {
        throw new Error('Failed to fetch part locations.');
      }
      const partLocsText = await partLocsResponse.text();
  
      // Split the text into lines and filter out empty lines
      const partLocsLines = partLocsText.split('\n').filter(line => line.trim() !== '');
  
      // Initialize a record to hold parts data per image ID
      const partsData: PartsData = {};
  
      // Parse each part location line
      partLocsLines.forEach(line => {
        // Split the line by whitespace
        const parts = line.split(/\s+/);
        if (parts.length < 5) { // Expecting five parts: imageId, partId, x, y, visible
          console.warn(`Malformed part location line: "${line}"`);
          return; // Skip malformed lines
        }
  
        const [imageId, partId, xStr, yStr, visibleStr] = parts;
  
        // Parse numerical values
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        const visible = visibleStr === '1';
  
        // Validate parsed values
        if (!imageId || !partId || isNaN(x) || isNaN(y)) {
          console.warn(`Incomplete or invalid data in line: "${line}"`);
          return;
        }
  
        // Initialize the array for this image ID if it doesn't exist
        if (!partsData[imageId]) {
          partsData[imageId] = [];
        }
  
        // Look up the part name using the part ID
        const partName = partNames[partId];
        if (partName) {
          partsData[imageId].push({
            partId,
            partName,
            x,
            y,
            visible,
          });
        } else {
          console.warn(`Part ID "${partId}" not found in parts names.`);
        }
      });
  
      // -----------------------------
      // Step 3: Return Parsed Parts Data
      // -----------------------------
  
      return partsData;
    } catch (error) {
      console.error('Error parsing parts data:', error);
      return {}; // Return an empty object in case of error
    }
  };
  