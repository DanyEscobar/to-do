import { Component, inject, input, OnChanges, output, SimpleChanges, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CATEGORY_COLORS } from '../../interfaces/category.interface';
import {
  IonInput, IonButton, IonIcon, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';

/**
 * Componente de formulario para crear y editar categorías.
 * Incluye selector de color visual con paleta predefinida.
 */
@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    IonInput, IonButton, IonIcon,
    IonCard, IonCardContent,
  ],
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnChanges {

  private readonly fb = inject(FormBuilder);

  /** Outputs */
  public categorySaved = output<{ name: string; color: string }>();
  public editCancel = output<void>();

  /** Inputs */
  public editMode = input<boolean>(false);
  public category = input<Category | undefined>();

  /** Estado */
  public selectedColor = signal<string>(CATEGORY_COLORS[0]);
  public availableColors = CATEGORY_COLORS;

  /** Formulario */
  public categoryForm: FormGroup;

  constructor() {
    addIcons({ addOutline, checkmarkOutline, closeOutline });

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category()) {
      this.categoryForm.patchValue({ name: this.category()?.name });
      this.selectedColor.set(this.category()?.color ?? CATEGORY_COLORS[0]);
    }

    if (changes['editMode'] && !this.editMode()) {
      this.categoryForm.reset({ name: '' });
      this.selectedColor.set(CATEGORY_COLORS[0]);
    }
  }

  /** Selecciona un color de la paleta */
  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  /** Envía el formulario */
  submitForm(): void {
    if (this.categoryForm.valid) {
      this.categorySaved.emit({
        name: this.categoryForm.value.name.trim(),
        color: this.selectedColor(),
      });
      this.categoryForm.reset({ name: '' });
      this.selectedColor.set(CATEGORY_COLORS[0]);
    }
  }

  /** Cancela la edición */
  cancelEdit(): void {
    this.categoryForm.reset({ name: '' });
    this.selectedColor.set(CATEGORY_COLORS[0]);
    this.editCancel.emit();
  }
}
