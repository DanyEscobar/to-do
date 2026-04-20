import { Component, inject, input, OnChanges, output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../interfaces/task.interface';
import { Category } from '../../interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  IonInput, IonButton, IonIcon,
  IonSelect, IonSelectOption, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';

/**
 * Componente de formulario para crear y editar tareas.
 * Soporta selección de categoría y modo edición.
 */
@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    IonInput, IonButton, IonIcon,
    IonSelect, IonSelectOption, IonCard, IonCardContent
],
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnChanges {

  private readonly fb = inject(FormBuilder);

  /** Outputs */
  public taskCreated = output<Task>();
  public editCancel = output<boolean>();

  /** Inputs */
  public editMode = input<boolean>(false);
  public task = input<Task | undefined>();
  public categories = input<Category[]>([]);
  public showCategories = input<boolean>(true);

  /** Formulario reactivo */
  public taskForm: FormGroup;

  constructor() {
    addIcons({ addOutline, checkmarkOutline, closeOutline });

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task()) {
      this.taskForm.patchValue({
        title: this.task()?.title,
        categoryId: this.task()?.categoryId ?? '',
      });
    }

    if (changes['editMode'] && !this.editMode()) {
      this.taskForm.reset({ title: '', categoryId: '' });
    }
  }

  /** Envía el formulario para crear o actualizar una tarea */
  submitForm(): void {
    if (this.taskForm.valid) {
      const values = this.taskForm.value;
      const newTask: Task = {
        id: this.task()?.id ?? uuidv4(),
        title: values.title.trim(),
        categoryId: values.categoryId || undefined,
        completed: this.task()?.completed ?? false,
        createdAt: this.task()?.createdAt ?? Date.now(),
      };

      this.taskCreated.emit(newTask);
      this.taskForm.reset({ title: '', categoryId: '' });
    }
  }

  /** Cancela el modo edición */
  cancelEdit(): void {
    this.taskForm.reset({ title: '', categoryId: '' });
    this.editCancel.emit(false);
  }
}
