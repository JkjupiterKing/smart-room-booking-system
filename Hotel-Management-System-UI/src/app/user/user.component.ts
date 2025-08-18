import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Ensure you have the correct import
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-user',
  imports: [FormsModule,CommonModule ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  registrationSuccess: boolean = false;

  user = { name: '', email: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  // Methods to handle modal visibility
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const { username, password } = loginForm.value;
      this.userService.loginUser(username, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Store username in localStorage for dashboard sidebar
          localStorage.setItem('user', JSON.stringify({ username }));
          this.successMessage = 'Login successful!';
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
          this.closeLoginModal();
          loginForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed', error);
          if (error.error) {
            this.errorMessage = error.error;
            alert(this.errorMessage);
          } else {
            this.errorMessage = 'Login failed. Please try again.';
            alert(this.errorMessage);
          }
        }
      });
    }
  }

  onRegisterSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      const password = registerForm.value.password;
      // Check if password is only numbers or only letters
      if (/^\d+$/.test(password) || /^[a-zA-Z]+$/.test(password)) {
        alert('Use a strong password: include both letters and numbers.');
        return;
      }
      this.userService.registerUser(registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Store username in localStorage for dashboard sidebar
          const { username } = registerForm.value;
          localStorage.setItem('user', JSON.stringify({ username }));
          this.successMessage = response;
          this.registrationSuccess = true;
          this.closeRegisterModal();
          registerForm.reset();
          setTimeout(() => {
            this.registrationSuccess = false;
            this.openLoginModal();
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed', error);
          if (error instanceof HttpErrorResponse) {
            const errorMessage = error.error || 'Error registering user';
            this.errorMessage = errorMessage;
            alert(errorMessage);
          } else {
            this.errorMessage = 'An unexpected error occurred';
            alert(this.errorMessage);
          }
        }
      });
    }
  }
}