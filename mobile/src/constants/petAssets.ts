// Pet evolution stages - using lucide icon names instead of emojis
export const PetStageIcons: Record<number, string> = {
  1: 'egg',           // Egg stage
  2: 'baby',          // Baby - we'll use 'bird' as closest
  3: 'feather',       // Teen
  4: 'bird',          // Adult
};

export const PetStageNames: Record<number, string> = {
  1: 'Яйцо',
  2: 'Малыш',
  3: 'Подросток',
  4: 'Взрослый',
};

export const MoodLabels: Record<string, string> = {
  happy: 'Счастлив',
  neutral: 'Нормально',
  sad: 'Грустит',
  sleeping: 'Спит',
};

// Mood icon names (lucide)
export const MoodIconNames: Record<string, string> = {
  happy: 'smile',
  neutral: 'meh',
  sad: 'frown',
  sleeping: 'moon',
};

export const MoodColors: Record<string, string> = {
  happy: '#40916C',
  neutral: '#B45309',
  sad: '#DC2626',
  sleeping: '#9CA3AF',
};
