import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    // Retrieve the user role from localStorage
    this.userRole = localStorage.getItem('role');
    console.log('Current user role:', this.userRole);
  }

  // Helper method to check if the user is a regular customer
  isUser(): boolean {
    return this.userRole === 'user';
  }

  // Helper method to check if the user is an admin
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  // Method to handle logout
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('admin'); // Remove admin info if stored
    this.userRole = null; // Clear local role
    this.router.navigate(['/user']).then(() => {
      window.location.reload(); // Reload to ensure full UI reset
    });
  }
}
