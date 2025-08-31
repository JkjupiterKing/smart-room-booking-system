import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private router: Router) {}

  login(): void {
    // Add your authentication logic here
    // For now, we'll just navigate to the admin dashboard
    localStorage.setItem('role', 'admin');
    this.router.navigate(['/admin/dashboard']);
  }
}
