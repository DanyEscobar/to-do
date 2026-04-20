import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, viewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonChip, IonLabel,
  IonRefresher, IonRefresherContent, IonToast
} from '@ionic/angular/standalone';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { ConfigService } from '../../services/config.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  pricetagsOutline, checkmarkDoneOutline, listOutline,
  funnelOutline, settingsOutline, speedometerOutline
} from 'ionicons/icons';

/**
 * Página principal de la aplicación To-Do.
 * Muestra el formulario de tareas, filtros por categoría y la lista de tareas.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon, IonChip, IonLabel,
    IonRefresher, IonRefresherContent, IonToast,
    TaskFormComponent, TaskListComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);
  private readonly configService = inject(ConfigService);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);

  /** Estado reactivo directamente de los servicios */
  public tasks = this.taskService.allTasks;
  public categories = this.categoryService.allCategories;
  
  public selectedCategory = signal<string>('');
  public editMode = signal<boolean>(false);
  public taskToEdit = signal<Task | undefined>(undefined);

  /** Referencia al componente hijo del formulario */
  private readonly taskFormRef = viewChild(TaskFormComponent);

  /** Feature flag de Firebase */
  public showCategories = this.configService.showCategories;

  /** Estadísticas computadas */
  public totalTasks = computed(() => this.tasks().length);
  public completedTasks = computed(() => this.tasks().filter(t => t.completed).length);
  public pendingTasks = computed(() => this.tasks().filter(t => !t.completed).length);

  constructor() {
    addIcons({
      pricetagsOutline, checkmarkDoneOutline, listOutline,
      funnelOutline, settingsOutline, speedometerOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  /** Inicializa datos de tareas, categorías y filtro persistido */
  private async initData(): Promise<void> {
    await Promise.all([
      this.taskService.loadTasks(),
      this.categoryService.loadCategories(),
    ]);

    // Restaurar filtro de categoría seleccionado
    const { value } = await Preferences.get({ key: 'selectedCategory' });
    if (value) {
      this.selectedCategory.set(value);
    }
  }

  /** Maneja el pull-to-refresh para recargar los datos */
  async handleRefresh(event: any): Promise<void> {
    // Resetear el estado de la interfaz como en una recarga real
    this.editMode.set(false);
    this.taskToEdit.set(undefined);
    this.selectedCategory.set('');
    this.taskFormRef()?.resetForm();
    
    await this.configService.forceFetchFlag();
    await this.initData();
    // Añadimos un pequeño timeout para que la animación sea visible,
    // ya que la lectura de LocalStorage es casi instantánea.
    setTimeout(() => {
      event.target.complete();
    }, 600);
  }

  /** Maneja la creación o actualización de una tarea */
  onTaskCreated(task: Task): void {
    if (this.editMode() && this.taskToEdit()) {
      this.taskService.updateTask(task);
      this.editMode.set(false);
      this.taskToEdit.set(undefined);
      this.presentToast('Tarea actualizada ✏️');
    } else {
      this.taskService.addTask(task);
      this.presentToast('Tarea agregada ✅');
    }
  }

  /** Selecciona una categoría para filtrar */
  async onCategorySelected(categoryId: string): Promise<void> {
    const newValue = this.selectedCategory() === categoryId ? '' : categoryId;
    this.selectedCategory.set(newValue);
    await Preferences.set({ key: 'selectedCategory', value: newValue });
  }

  /** Inicia el modo edición de una tarea */
  onEdit(task: Task): void {
    this.editMode.set(true);
    this.taskToEdit.set({ ...task });

    // Scroll hacia arriba para ver el formulario
    const content = document.querySelector('ion-content');
    content?.scrollToTop(300);
  }

  /** Elimina una tarea */
  onDelete(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.presentToast('Tarea eliminada 🗑️');
    this.editMode.set(false);
  }

  /** Actualiza datos al marcar/desmarcar una tarea */
  onToggle(): void {
    // La UI se actualiza automáticamente gracias a los signals
  }

  /** Navega a la página de gestión de categorías */
  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  /** Muestra un toast */
  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
