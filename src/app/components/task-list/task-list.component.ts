import { Component, computed, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import {
  IonList, IonItem, IonLabel, IonCheckbox,
  IonButtons, IonButton, IonIcon, IonChip,
  IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

/**
 * Componente de lista de tareas con filtrado por categoría.
 * Usa OnPush para optimización de rendimiento y trackBy con task.id.
 */
@Component({
  selector: 'app-task-list',
  imports: [
    IonList, IonItem, IonLabel, IonCheckbox,
    IonButtons, IonButton, IonIcon, IonChip,
    IonItemSliding, IonItemOptions, IonItemOption,
    DeleteModalComponent,
  ],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {

  private readonly taskService = inject(TaskService);
  readonly categoryService = inject(CategoryService);

  /** Inputs */
  public tasks = input<Task[]>([]);
  public filterByCategory = input<string>('');
  public showCategories = input<boolean>(true);

  /** Outputs */
  public editTask = output<Task>();
  public deleteTask = output<string>();
  public toggleTask = output<string>();

  /** Estado del modal de eliminación */
  public modalOpen = signal<boolean>(false);
  public taskIdToDelete = signal<string | null>(null);

  /** Lista filtrada de tareas (señal computada para rendimiento) */
  public filteredTasks = computed(() => {
    const showCat = this.showCategories();
    const category = showCat ? this.filterByCategory() : '';
    const allTasks = this.tasks();
    const filtered = category
      ? allTasks.filter(task => task.categoryId === category)
      : allTasks;

    // Ordenar: pendientes primero, luego por fecha de creación (más reciente primero)
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
  });

  constructor() {
    addIcons({ createOutline, trashOutline, checkmarkCircle, ellipseOutline });
  }

  /** Alterna el estado completado de una tarea y notifica al padre */
  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task.id);
    this.toggleTask.emit(task.id);
  }

  /** Emite evento de edición */
  onEdit(task: Task): void {
    this.editTask.emit(task);
  }

  /** Emite evento de eliminación */
  onDelete(id: string): void {
    this.deleteTask.emit(id);
  }

  /** Abre el modal de confirmación de eliminación */
  openDeleteModal(id: string): void {
    this.taskIdToDelete.set(id);
    this.modalOpen.set(true);
  }

  /** Confirma eliminación */
  confirmDelete(): void {
    if (this.taskIdToDelete()) {
      this.onDelete(this.taskIdToDelete()!);
    }
    this.modalOpen.set(false);
    this.taskIdToDelete.set(null);
  }

  /** Cancela eliminación */
  cancelDelete(): void {
    this.modalOpen.set(false);
    this.taskIdToDelete.set(null);
  }

  /** TrackBy function para optimizar renderizado de la lista */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
