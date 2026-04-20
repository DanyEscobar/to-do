import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { Category } from '../../interfaces/category.interface';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, arrowBackOutline, pricetagsOutline } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';

/**
 * Página de gestión de categorías.
 * Permite crear, editar y eliminar categorías con colores personalizados.
 */
@Component({
  selector: 'app-categories',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonButton, IonIcon,
    IonList, IonItem, IonLabel,
    CategoryFormComponent, DeleteModalComponent,
  ],
  standalone: true,
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {

  readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly toastController = inject(ToastController);

  /** Estado */
  public editMode = signal<boolean>(false);
  public categoryToEdit = signal<Category | undefined>(undefined);
  public modalOpen = signal<boolean>(false);
  public categoryIdToDelete = signal<string | null>(null);

  constructor() {
    addIcons({ createOutline, trashOutline, arrowBackOutline, pricetagsOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.categoryService.loadCategories();
  }

  /** Maneja el guardado de una categoría (crear o actualizar) */
  async onCategorySaved(data: { name: string; color: string }): Promise<void> {
    // Validar nombre único
    const excludeId = this.editMode() ? this.categoryToEdit()?.id : undefined;
    if (this.categoryService.categoryExists(data.name, excludeId)) {
      await this.presentToast('Ya existe una categoría con ese nombre', 'warning');
      return;
    }

    if (this.editMode() && this.categoryToEdit()) {
      await this.categoryService.updateCategory(
        this.categoryToEdit()!.id, data.name, data.color
      );
      this.editMode.set(false);
      this.categoryToEdit.set(undefined);
      await this.presentToast('Categoría actualizada');
    } else {
      await this.categoryService.addCategory(data.name, data.color);
      await this.presentToast('Categoría creada');
    }
  }

  /** Inicia el modo edición para una categoría */
  onEdit(category: Category): void {
    this.editMode.set(true);
    this.categoryToEdit.set({ ...category });
  }

  /** Cancela la edición */
  onEditCancel(): void {
    this.editMode.set(false);
    this.categoryToEdit.set(undefined);
  }

  /** Abre el modal de confirmación de eliminación */
  openDeleteModal(id: string): void {
    this.categoryIdToDelete.set(id);
    this.modalOpen.set(true);
  }

  /** Confirma la eliminación de una categoría */
  async confirmDelete(): Promise<void> {
    const id = this.categoryIdToDelete();
    if (id) {
      await this.categoryService.deleteCategory(id);
      // Limpiar referencias en tareas
      await this.taskService.clearCategoryFromTasks(id);
      await this.presentToast('Categoría eliminada');
    }
    this.modalOpen.set(false);
    this.categoryIdToDelete.set(null);
    this.editMode.set(false);
    this.categoryToEdit.set(undefined);
  }

  /** Cancela la eliminación */
  cancelDelete(): void {
    this.modalOpen.set(false);
    this.categoryIdToDelete.set(null);
  }

  /** Muestra un toast con mensaje */
  private async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
