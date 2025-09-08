import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-registration-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-registration-modal.component.html',
  styleUrls: ['./user-registration-modal.component.css']
})
export class UserRegistrationModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  close() {
    this.closeModal.emit();
  }
}
