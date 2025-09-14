import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  private apiUrl = 'http://localhost:8066/api/users';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users fetched successfully:', this.users);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/delete/${id}`).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          console.log(`User with ID ${id} deleted successfully.`);
        },
        error: (error) => {
          console.error(`Error deleting user with ID ${id}:`, error);
        }
      });
    }
  }
}
