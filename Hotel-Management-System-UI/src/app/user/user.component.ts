import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {}

  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const { username, password } = loginForm.value;

      // Attempt customer login first
      this.userService.loginUser(username, password).subscribe({
        next: (response) => {
          console.log('Customer login successful', response);
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }
          this.successMessage = 'Login successful!';
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
          this.closeLoginModal();
          loginForm.reset();
        },
        error: (userError: HttpErrorResponse) => {
          console.warn('Customer login failed, attempting admin login...', userError);
          // If customer login fails, attempt admin login
          this.adminService.loginAdmin(username, password).subscribe({
            next: (adminResponse: string) => { // Expect adminResponse as a string
              console.log('Admin login successful', adminResponse);
              // Store admin info and role
              // Since the backend returns a String, we'll just store the username and role.
              localStorage.setItem('admin', JSON.stringify({ username: username })); 
              localStorage.setItem('role', 'admin'); 
              this.successMessage = 'Admin login successful!';
              this.router.navigate(['/admin-dashboard']).then(() => {
                window.location.reload();
              });
              this.closeLoginModal();
              loginForm.reset();
            },
            error: (adminError: HttpErrorResponse) => {
              console.error('Admin login failed', adminError);
              this.errorMessage = 'Invalid Credentials for both Customer and Admin.';
              alert(this.errorMessage);
            }
          });
        }
      });
    }
  }

  onRegisterSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      this.userService.registerUser(registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }
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

