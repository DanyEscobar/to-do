/**
 * Interfaz para categorías de tareas.
 * Cada categoría tiene un color asociado para identificación visual.
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
}

/** Colores predefinidos disponibles para categorías */
export const CATEGORY_COLORS: string[] = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16', // Lime
];
