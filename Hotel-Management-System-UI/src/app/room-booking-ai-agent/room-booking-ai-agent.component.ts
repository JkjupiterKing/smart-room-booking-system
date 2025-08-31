import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

// Extend the Window interface to include webkitSpeechRecognition for better type safety
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}


@Component({
  selector: 'app-room-booking-ai-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './room-booking-ai-agent.component.html',
  styleUrl: './room-booking-ai-agent.component.css'
})
export class RoomBookingAiAgentComponent implements OnInit, OnDestroy {
  // Search related properties
  selectedLocation: string = '';
  locations: string[] = []; // Will hold list of city names
  isListening: boolean = false;
  recognition: any; // For Web Speech API
  feedbackMessage: string = ''; // To display messages to the user below the search bar
  noResultsFound: boolean = false; // New flag to control "no results" display
  
  private locationsApiUrl = 'http://localhost:8066/api/locations/all'; // Location API URL

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for voice updates
  ) { }

  ngOnInit(): void {
    this.fetchLocations(); // Fetch locations on component initialization
    this.initVoiceRecognition(); // Initialize voice recognition
    this.feedbackMessage = "Enter or speak a location to find hotels."; // Initial prompt
  }

  ngOnDestroy(): void {
    // Stop voice recognition if component is destroyed
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Fetches the list of available locations (cities) from the backend.
   */
  fetchLocations(): void {
    this.http.get<{ id: number, country: string | null, city: string }[]>(
      this.locationsApiUrl
    ).subscribe({
      next: (data) => {
        this.locations = data
          .map(item => item.city)
          .filter(city => !!city); // Filter out null/undefined cities
        console.log('Fetched locations:', this.locations);
      },
      error: (err) => {
        console.error('Failed to fetch cities:', err);
        this.feedbackMessage = 'Could not load city list. Please try again later.';
      }
    });
  }

  /**
   * Navigates to the room booking page with the selected location as a query parameter.
   */
  searchLocation(): void {
    this.noResultsFound = false; // Reset before new search attempt

    if (this.selectedLocation) {
      // Check if the location is valid (case-insensitive comparison)
      if (this.locations.some(loc => loc.toLowerCase() === this.selectedLocation.toLowerCase())) {
        this.router.navigate(['/roombooking'], {
          queryParams: { location: this.selectedLocation },
        });
        this.feedbackMessage = `Searching for hotels in ${this.selectedLocation}...`;
      } else {
        this.feedbackMessage = `No results found for '${this.selectedLocation}'.`;
        this.noResultsFound = true; // Set flag to show back button and "no results" message
      }
    } else {
      this.feedbackMessage = 'Please enter or speak a location to search for hotels.';
    }
  }

  /**
   * Initializes the Web Speech Recognition API.
   */
  initVoiceRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = false; // Recognizes a single utterance
      this.recognition.interimResults = false; // Returns only final results
      this.recognition.lang = 'en-US'; // Set language

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript);
        this.selectedLocation = transcript; // Populate search bar
        this.isListening = false;
        this.cdr.detectChanges(); // Manually trigger change detection

        // Automatically search if the recognized text is a valid location
        this.searchLocation(); // Call searchLocation to handle logic
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.feedbackMessage = 'Voice recognition error. Please try again.';
        this.cdr.detectChanges();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.cdr.detectChanges();
      };
    } else {
      console.warn('Web Speech API is not supported in this browser.');
      this.feedbackMessage = 'Your browser does not support voice search.';
    }
  }

  /**
   * Starts the voice recognition process.
   */
  startVoiceSearch(): void {
    if (this.recognition) {
      this.isListening = true;
      this.recognition.start();
      this.selectedLocation = ''; // Clear previous input
      this.feedbackMessage = 'Listening for your location...';
      this.noResultsFound = false; // Hide "no results" when starting a new search
    }
  }

  /**
   * Stops the voice recognition process.
   */
  stopVoiceSearch(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      this.feedbackMessage = 'Stopped listening.';
    }
  }

  /**
   * Handles the back action when no results are found.
   */
  goBack(): void {
    this.noResultsFound = false;
    this.selectedLocation = ''; // Clear search bar
    this.feedbackMessage = "Enter or speak a location to find hotels.";
  }
}
