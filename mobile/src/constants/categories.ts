export const CATEGORIES = ['ecology', 'social', 'animals', 'education'] as const;
export type Category = typeof CATEGORIES[number];
