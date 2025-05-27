import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonSelect,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Task } from 'src/app/interfaces/task.interface';
import { TaskService } from 'src/app/services/task.service';
import { TaskFormComponent } from "../../components/task-form/task-form.component";
import { TaskListComponent } from "../../components/task-list/task-list.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TaskFormComponent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    TaskListComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true
})
export class HomePage implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly configService = inject(ConfigService);
  private readonly toastController = inject(ToastController);
  public tasks = signal<Task[]>([]);
  public selectedCategory = signal<string>('');
  public editMode = signal<boolean>(false);
  public taskToEdit = signal<Task | undefined>(undefined);
  public showCategories = this.configService.showCategories;

  constructor() {}

  ngOnInit() {
    this.initData();
  }

  private async initData(): Promise<void> {
    await this.onTaskLoad();

    const { value } = await Preferences.get({ key: 'selectedCategory' });
    if (value) {
      this.selectedCategory.set(value);
    }
  }

  async onTaskLoad(): Promise<void> {
    await this.taskService.loadTasks();
    this.tasks.set(this.taskService.getTasks());
  }

  onTaskCreated(task: Task): void {
    if (this.editMode() && this.taskToEdit()) {
      this.taskService.updateTask(task);
      this.editMode.set(false);
      this.taskToEdit.set(undefined);
      this.presentToast('Tarea actualizada');
    } else {
      this.taskService.addTask(task);
      this.presentToast('Tarea agregada');
    }
    this.tasks.set(this.taskService.getTasks());
  }

  async onCategorySelected(category: string): Promise<void> {
    this.selectedCategory.set(category);
    await Preferences.set({ key: 'selectedCategory', value: category });
  }

  onEdit(task: Task): void {
    this.editMode.set(true);
    this.taskToEdit.set({ ...task });
  }

  onDelete(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.tasks.set(this.taskService.getTasks());
    this.presentToast('Tarea eliminada');
  }

  getUniqueCategories(): (string | undefined)[] {
    const categories = this.tasks().map(t => t.category).filter(Boolean);
    return [...new Set(categories)];
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
