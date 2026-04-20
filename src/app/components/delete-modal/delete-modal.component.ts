import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import {
  IonButton, IonModal, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, closeOutline, trashOutline } from 'ionicons/icons';

/**
 * Modal de confirmación para eliminación de elementos.
 * Reutilizable para tareas y categorías.
 */
@Component({
  selector: 'app-delete-modal',
  imports: [
    IonModal, IonButton, IonIcon,
  ],
  standalone: true,
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModalComponent {

  public open = input<boolean>(false);
  public title = input<string>('Confirmar eliminación');
  public message = input<string>('¿Estás seguro de que deseas eliminar este elemento?');
  public confirm = output();
  public cancel = output();

  constructor() {
    addIcons({ alertCircleOutline, closeOutline, trashOutline });
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
