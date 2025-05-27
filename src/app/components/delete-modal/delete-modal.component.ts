import { Component, input, output } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal } from "@ionic/angular/standalone";

@Component({
  selector: 'app-delete-modal',
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ],
  standalone: true,
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {

  public open = input<boolean>(false);
  public confirm = output();
  public cancel = output();

  constructor() {
    console.log(this.open());

  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
