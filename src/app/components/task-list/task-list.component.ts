import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Task } from 'src/app/interfaces/task.interface';
import { IonList, IonItem, IonLabel, IonCheckbox, IonButtons, IonButton, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { DeleteModalComponent } from "../delete-modal/delete-modal.component";
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [IonIcon, IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    CommonModule,
    IonButtons,
    IonButton,
    IonIcon,
    DeleteModalComponent
  ],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {

  private readonly taskService = inject(TaskService);
  public tasks = input<Task[]>([]);
  public filterByCategory = input<string>('');
  public editTask = output<Task>();
  public deleteTask = output<string>();
  public filteredTasks = computed(() => {
    const category = this.filterByCategory();
    const allTasks = this.tasks();
    return category ? allTasks.filter(task => task.category === category) : allTasks;
  });
  public modalOpen = signal<boolean>(false);
  public taskIdToDelete = signal<string | null>(null);

  constructor() {
    addIcons({
      createOutline,
      trashOutline,
    });
  }

  toggleComplete(task: Task): void {
    task.completed = !task.completed;
    this.taskService.saveTasks();
  }

  onEdit(task: Task): void {
    this.editTask.emit(task);
  }

  onDelete(id: string): void {
    this.deleteTask.emit(id);
  }

  openDeleteModal(id: string) {
    this.taskIdToDelete.set(id);
    this.modalOpen.set(true);
  }

  confirmDelete() {
    if (this.taskIdToDelete()) {
      this.onDelete(this.taskIdToDelete()!);
    }
    this.modalOpen.set(false);
    this.taskIdToDelete.set(null);
  }

  cancelDelete() {
    this.modalOpen.set(false);
    this.taskIdToDelete.set(null);
  }

}
