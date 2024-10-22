// src/components/PartsOverlay.tsx

import React from 'react';
import { Part } from '../utils/parseParts';
import { Tooltip } from '@mui/material';

interface PartsOverlayProps {
  parts: Part[];
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
}

const PartsOverlay: React.FC<PartsOverlayProps> = ({
  parts,
  naturalWidth,
  naturalHeight,
  renderedWidth,
  renderedHeight,
}) => {
  // Calculate scaling factors
  const scaleX = renderedWidth / naturalWidth;
  const scaleY = renderedHeight / naturalHeight;

  return (
    <svg
      width={renderedWidth}
      height={renderedHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto', // Enable interactions
      }}
    >
      {parts.map((part, index) => (
        <Tooltip key={`${part.partId}-${index}`} title={part.partName} arrow>
          <circle
            cx={part.x * scaleX}
            cy={part.y * scaleY}
            r={5}
            fill="rgba(0, 0, 255, 0.6)"
            stroke="white"
            strokeWidth={2}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      ))}
    </svg>
  );
};

export default PartsOverlay;
