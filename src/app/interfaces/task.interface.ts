/**
 * Interfaz para tareas del To-Do List.
 * Utiliza categoryId para la relación con categorías.
 */
export interface Task {
  id: string;
  title: string;
  categoryId?: string;
  completed: boolean;
  createdAt: number;
}
