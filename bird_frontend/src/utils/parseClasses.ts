// src/utils/parseClasses.ts

import { GCS_BASE_URL } from './constants';

export interface ClassesData {
  classIdToName: Record<string, string>;
  nameToClassId: Record<string, string>;
}

export const parseClasses = async (): Promise<ClassesData> => {
  const response = await fetch(`${GCS_BASE_URL}/classes.txt`);
  if (!response.ok) {
    throw new Error(`Failed to fetch classes.txt: ${response.statusText}`);
  }
  const text = await response.text();
  const lines = text.trim().split('\n');

  const classIdToName: Record<string, string> = {};
  const nameToClassId: Record<string, string> = {};

  lines.forEach((line) => {
    const [classId, ...classNameParts] = line.trim().split(' ');
    const classNameRaw = classNameParts.join(' ');
    const className = classNameRaw.replace(/_/g, ' ');
    const classNameNormalized = className.toLowerCase();
    classIdToName[classId] = className;
    nameToClassId[classNameNormalized] = classId;
  });

  return { classIdToName, nameToClassId };
};
