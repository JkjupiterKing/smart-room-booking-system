import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';  // adjust path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']  // fix typo here
})
export class LocationComponent {}
