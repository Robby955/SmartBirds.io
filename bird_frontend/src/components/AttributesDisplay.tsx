// src/components/AttributesDisplay.tsx

import React from 'react';
import { List, ListItem, ListItemText, Chip } from '@mui/material';
import { Attribute } from '../utils/parseAttributes';

interface AttributesDisplayProps {
  attributes: Attribute[];
}

const AttributesDisplay: React.FC<AttributesDisplayProps> = ({ attributes }) => {
  const getAttributeColor = (certainty: number) => {
    if (certainty >= 3) return 'success'; // Very certain
    if (certainty === 2) return 'warning'; // Somewhat certain
    return 'error'; // Not certain
  };

  return (
    <List>
      {attributes.map((attr, index) => (
        <ListItem key={index} divider>
          <ListItemText primary={attr.name} />
          <Chip
            label={attr.isPresent ? 'Present' : 'Absent'}
            color={getAttributeColor(attr.certainty)}
            variant="outlined"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AttributesDisplay;
