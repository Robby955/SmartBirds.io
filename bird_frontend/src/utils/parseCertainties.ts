// src/utils/parseCertainties.ts

import { GCS_BASE_URL } from './constants';

/**
 * Parses the certainties.txt file to create a mapping of certainty IDs to their names.
 * 
 * File format:
 * <certainty_id> <certainty_name>
 * 
 * Example:
 * 1 Not_visible
 * 2 Guessing
 * 3 Somewhat_certain
 * 4 Very_certain
 */
export const parseCertainties = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${GCS_BASE_URL}/attributes/certainties.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch certainties.txt: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const certainties: Record<string, string> = {};

    lines.forEach((line) => {
      const [certaintyId, ...certaintyNameParts] = line.trim().split(' ');
      const certaintyNameRaw = certaintyNameParts.join(' ');
      const certaintyName = certaintyNameRaw.replace(/_/g, ' ');
      certainties[certaintyId] = certaintyName;
    });

    return certainties;
  } catch (error) {
    console.error('Error in parseCertainties:', error);
    return {};
  }
};
