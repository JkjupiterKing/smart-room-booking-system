import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  hotels$: Observable<Hotel[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private searchResultsService: SearchResultsService,
    private router: Router
  ) {
    this.hotels$ = this.searchResultsService.hotels$;
    this.isLoading$ = this.searchResultsService.isLoading$;
  }

  ngOnInit(): void {}

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }

  navigateToHotel(hotelId: number): void {
    this.router.navigate(['/hotel', hotelId]);
  }
}
