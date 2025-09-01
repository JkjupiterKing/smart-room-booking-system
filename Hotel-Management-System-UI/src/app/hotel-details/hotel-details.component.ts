import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../hotel/hotel.service';
import { Hotel } from '../search-results.service';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, UserNavbarComponent, AdminNavbarComponent],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  hotel: Hotel | undefined;
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) { }

  ngOnInit(): void {
    this.checkUserStatus();
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(+hotelId).subscribe(hotel => {
        this.hotel = hotel;
      });
    }
  }

  checkUserStatus(): void {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      if (role) {
        this.isLoggedIn = true;
        this.userRole = role;
      }
    }
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }
}
