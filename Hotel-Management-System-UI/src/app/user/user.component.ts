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
  successMessage: string = ''; // Success message for successful registration
  errorMessage: string = ''; // Error message for failed registration

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
          this.successMessage = 'Login successful!';
          this.router.navigate(['/dashboard']);
          this.closeLoginModal();
          loginForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed', error);
          
          if (error.error) {
            // Show the error message from the backend
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
  // Submit logic for registration form
//   onRegisterSubmit(registerForm: NgForm) {
//     if (registerForm.valid) {
//       this.userService.registerUser(registerForm.value).subscribe(
//         (response) => {
//           console.log('Registration successful', response);
//           this.closeRegisterModal(); // Close register modal upon success
//           this.openLoginModal(); // Open login modal after successful registration
//           registerForm.reset(); // Reset the form and clear the fields
//         },
//         (error) => {
//           console.error('Registration failed', error);
//           alert('Error registering user');
//         }
//       );
//     }
//   }


onRegisterSubmit(registerForm: NgForm) {
  if (registerForm.valid) {
    this.userService.registerUser(registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.successMessage = response; // Store the success message
        this.closeRegisterModal();
        this.openLoginModal();
        registerForm.reset();
      },
      error: (error) => {
        console.error('Registration failed', error);
        
        if (error instanceof HttpErrorResponse) {
          // If the error response contains a message
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