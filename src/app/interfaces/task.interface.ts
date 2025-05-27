export interface Task {
  id: string;
  title: string;
  category?: string;
  completed: boolean;
  createdAt: number;
}
