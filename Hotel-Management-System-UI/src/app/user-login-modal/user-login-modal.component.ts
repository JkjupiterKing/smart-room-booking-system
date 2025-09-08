import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login-modal.component.html',
  styleUrls: ['./user-login-modal.component.css']
})
export class UserLoginModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  close() {
    this.closeModal.emit();
  }
}
