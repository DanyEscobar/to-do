import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from 'src/app/interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasks = signal<Task[]>([]);

  async loadTasks(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'tasks' });
      const parsed = value ? JSON.parse(value) : [];
      this.tasks.set(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error parsing tasks from storage:', error);
      this.tasks.set([]);
    }
  }

  async saveTasks(): Promise<void> {
    await Preferences.set({ key: 'tasks', value: JSON.stringify(this.tasks()) });
  }

  addTask(task: Task) {
    this.tasks.update((currentTasks) => [ ...currentTasks, task ]);
    console.log(this.tasks());

    this.saveTasks();
  }

  getTasks(): Task[] {
    return [...this.tasks()];
  }

  async updateTask(updatedTask: Task): Promise<void> {
    const updatedList = this.tasks().map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    this.tasks.set(updatedList);
    await this.saveTasks();
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks.update((currentTasks) => currentTasks.filter(t => t.id !== id));
    await this.saveTasks();
  }
}
