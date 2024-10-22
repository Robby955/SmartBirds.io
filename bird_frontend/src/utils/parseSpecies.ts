// src/utils/parseSpecies.ts
export const parseSpecies = async (): Promise<string[]> => {
  const response = await fetch('/classes.txt');
  const text = await response.text();

  // Split by lines and extract species names without numbers
  const speciesList = text.split('\n').map(line => {
    const parts = line.trim().split(' '); // Split line by spaces
    const speciesNameWithUnderscores = parts.slice(1).join('_'); // Join the remaining parts into a species name

    // If parts are invalid (like empty lines), return null
    if (!speciesNameWithUnderscores) return null;

    // Remove numbers and replace all underscores with spaces
    return speciesNameWithUnderscores.replace(/\d+\./, '').replace(/_/g, ' ');
  }).filter(species => species !== null); // Filter out any null entries

  return speciesList as string[];
  };