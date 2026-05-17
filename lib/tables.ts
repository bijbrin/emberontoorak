export type Table = {
  id: string;
  seats: number;
  x: number;
  y: number;
  shape: 'round' | 'rect' | 'long';
  status: 'available' | 'booked';
  accessible?: boolean;
  label?: string;
};

export const TABLES: Table[] = [
  { id: 'T1', seats: 2, x: 22, y: 26, shape: 'round', status: 'available', label: 'Window' },
  { id: 'T2', seats: 4, x: 48, y: 28, shape: 'rect', status: 'available' },
  { id: 'T3', seats: 6, x: 76, y: 32, shape: 'rect', status: 'booked' },
  { id: 'T4', seats: 4, x: 26, y: 52, shape: 'rect', status: 'available', accessible: true },
  { id: 'T5', seats: 2, x: 78, y: 56, shape: 'round', status: 'available', label: 'Garden' },
  { id: 'T6', seats: 12, x: 50, y: 73, shape: 'long', status: 'available', label: "Chef's Table" },
  { id: 'T7', seats: 4, x: 22, y: 82, shape: 'rect', status: 'booked' },
  { id: 'T8', seats: 6, x: 78, y: 82, shape: 'rect', status: 'available', accessible: true },
];

export const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Business Dinner',
  'Date Night',
  'Celebration',
  'Other',
] as const;
