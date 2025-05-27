import { Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from 'src/app/interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ],
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent  implements OnChanges {

  private readonly fb = inject(FormBuilder);
  public taskCreated = output<Task>();
  public editCancel = output<boolean>();
  public taskForm: FormGroup;
  public editMode = input<boolean>();
  public task = input<Task>();

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task()) {
      this.taskForm.patchValue({
        title: this.task()?.title,
        category: this.task()?.category ?? ''
      });
    }

    if (!this.editMode()) {
      this.taskForm.reset();
    }
  }

  submitForm(): void {
    if (this.taskForm.valid) {
      const values = this.taskForm.value;
      const newTask: Task = {
        id: this.task()?.id ?? uuidv4(),
        title: values.title,
        category: values.category,
        completed: this.task()?.completed ?? false,
        createdAt: this.task()?.createdAt ?? Date.now()
      };

      this.taskCreated.emit(newTask);
      this.taskForm.reset();
    }
  }

  cancelEdit(): void {
    this.taskForm.reset();
    this.editCancel.emit(false);
  }

}
