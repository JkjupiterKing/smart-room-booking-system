import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  hotels$: Observable<Hotel[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private searchResultsService: SearchResultsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.hotels$ = this.searchResultsService.hotels$;
    this.isLoading$ = this.searchResultsService.isLoading$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const city = params['city'];
      const checkIn = params['checkIn'];
      const checkOut = params['checkOut'];

      if (city) {
        this.searchResultsService
          .fetchHotelsByCity(city, checkIn, checkOut)
          .subscribe();
      }
    });
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }

  navigateToHotel(hotelId: number): void {
    this.router.navigate(['/hotel', hotelId]);
  }
}
