import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  images: string[] = [];
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
    ,
    private router: Router
  ) { }

  bookNow(): void {
    if (!this.hotel) {
      alert('No hotel selected');
      return;
    }

  const city = this.hotel.location?.city || '';
  const hotelId = this.hotel.id;
  // Navigate to the room booking component and pass the city and hotelId as query params
  this.router.navigate(['/user/roombooking'], { queryParams: { location: city, hotelId } });
  }

  ngOnInit(): void {
    this.checkUserStatus();
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(+hotelId).subscribe(hotel => {
        this.hotel = hotel;
  // build images array from available base64 fields, detect MIME from signature
  this.images = [];
  const pushIf = (b64?: string) => {
    if (b64 && b64.length > 10) {
      this.images.push(this.getImageDataUri(b64));
    }
  };
  pushIf((hotel as any).imageBase64);
  pushIf((hotel as any).imageBase64_2);
  pushIf((hotel as any).imageBase64_3);
  pushIf((hotel as any).imageBase64_4);
  pushIf((hotel as any).imageBase64_5);
      });
    }
  }

  /**
   * Create data URI with a guessed mime type from base64 signature.
   */
  getImageDataUri(b64: string): string {
    const sig = b64.slice(0, 8);
    let mime = 'jpeg';
    // PNG files often start with "iVBOR" in base64, JPEG often "/9j/"
    if (sig.startsWith('iVBOR')) { mime = 'png'; }
    else if (sig.startsWith('/9j/')) { mime = 'jpeg'; }
    else if (sig.toLowerCase().includes('png')) { mime = 'png'; }
    return `data:image/${mime};base64,${b64}`;
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
