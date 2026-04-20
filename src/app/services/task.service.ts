import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from '../interfaces/task.interface';

/**
 * Servicio para gestión de tareas.
 * Usa señales (signals) para estado reactivo y debounce para optimizar escrituras.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {

  private readonly STORAGE_KEY = 'tasks';
  private readonly tasks = signal<Task[]>([]);
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 300;

  /** Señal reactiva con todas las tareas */
  readonly allTasks = signal<Task[]>([]);

  /**
   * Carga las tareas desde el almacenamiento local.
   */
  async loadTasks(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      const parsed = value ? JSON.parse(value) : [];
      const taskList = Array.isArray(parsed) ? this.migrateTasks(parsed) : [];
      this.tasks.set(taskList);
      this.allTasks.set(taskList);
    } catch (error) {
      console.error('Error parsing tasks from storage:', error);
      this.tasks.set([]);
      this.allTasks.set([]);
    }
  }

  /**
   * Migra tareas antiguas que usaban `category` (string) a `categoryId`.
   * Esto permite compatibilidad hacia atrás.
   */
  private migrateTasks(tasks: any[]): Task[] {
    return tasks.map(task => {
      // Si tiene 'category' pero no 'categoryId', intentar migrar
      if (task.category && !task.categoryId) {
        const migrated: Task = {
          id: task.id,
          title: task.title,
          categoryId: undefined, // No podemos mapear string a ID automáticamente
          completed: task.completed ?? false,
          createdAt: task.createdAt ?? Date.now(),
        };
        return migrated;
      }
      return {
        id: task.id,
        title: task.title,
        categoryId: task.categoryId,
        completed: task.completed ?? false,
        createdAt: task.createdAt ?? Date.now(),
      };
    });
  }

  /**
   * Persiste las tareas con debounce para evitar escrituras excesivas.
   */
  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(async () => {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(this.tasks()),
      });
    }, this.DEBOUNCE_MS);
  }

  /** Guarda inmediatamente (para operaciones críticas) */
  async saveTasksImmediate(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(this.tasks()),
    });
  }

  /** Agrega una nueva tarea */
  addTask(task: Task): void {
    this.tasks.update(currentTasks => [...currentTasks, task]);
    this.allTasks.set([...this.tasks()]);
    this.debouncedSave();
  }

  /** Devuelve una copia de todas las tareas */
  getTasks(): Task[] {
    return [...this.tasks()];
  }

  /** Actualiza una tarea existente */
  async updateTask(updatedTask: Task): Promise<void> {
    const updatedList = this.tasks().map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    this.tasks.set(updatedList);
    this.allTasks.set([...updatedList]);
    await this.saveTasksImmediate();
  }

  /** Elimina una tarea por ID */
  async deleteTask(id: string): Promise<void> {
    this.tasks.update(currentTasks => currentTasks.filter(t => t.id !== id));
    this.allTasks.set([...this.tasks()]);
    await this.saveTasksImmediate();
  }

  /** Alterna el estado completado de una tarea */
  async toggleComplete(taskId: string): Promise<void> {
    this.tasks.update(currentTasks =>
      currentTasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    this.allTasks.set([...this.tasks()]);
    this.debouncedSave();
  }

  /**
   * Limpia el categoryId de todas las tareas que referencian una categoría eliminada.
   */
  async clearCategoryFromTasks(categoryId: string): Promise<void> {
    this.tasks.update(currentTasks =>
      currentTasks.map(t =>
        t.categoryId === categoryId ? { ...t, categoryId: undefined } : t
      )
    );
    this.allTasks.set([...this.tasks()]);
    await this.saveTasksImmediate();
  }
}
