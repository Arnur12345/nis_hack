import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Centralized icon component using MaterialCommunityIcons
// All icon names: https://pictogrammers.com/library/mdi/

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 20, color = '#000' }: Props) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
