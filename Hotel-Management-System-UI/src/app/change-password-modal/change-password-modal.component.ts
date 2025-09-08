import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() passwordChange = new EventEmitter<string>();

  newPassword = '';
  reenteredPassword = '';
  errorMessage = '';

  constructor() { }

  closeModal(): void {
    this.close.emit();
  }

  changePassword(): void {
    if (this.newPassword !== this.reenteredPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    this.passwordChange.emit(this.newPassword);
  }
}
