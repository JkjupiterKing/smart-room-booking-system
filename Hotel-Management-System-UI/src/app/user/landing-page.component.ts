import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AiSearchService } from '../ai-search.service';
import { Hotel } from '../search-results.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  hotels: Hotel[] = [];
  // Modal states
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  registrationSuccess: boolean = false;

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  // User data
  user = {
    name: '',
    email: '',
    password: ''
  };

  // Search bar
  locations: any[] = [];
  selectedCity: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  guestCount: number = 1;
  aiSearchQuery: string = '';
  isRecording: boolean = false;
  private recognition: any = null;
  private recognitionStarted: boolean = false;
  private recognitionStarting: boolean = false;

  // Min date values for validations
  today: string = '';
  minCheckoutDate: string = '';

  constructor(
  private userService: UserService,
  private adminService: AdminService,
  private router: Router,
  private aiSearchService: AiSearchService,
  private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.fetchLocations();
    this.setTodayDate();
  }

  // Set today's date in yyyy-MM-dd format
  setTodayDate(): void {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    this.minCheckoutDate = this.today;
  }

  // Update min checkout date based on selected check-in date
  updateMinCheckoutDate(): void {
    if (this.checkInDate) {
      const checkIn = new Date(this.checkInDate);
      const nextDay = new Date(checkIn);
      nextDay.setDate(checkIn.getDate() + 1);
      this.minCheckoutDate = nextDay.toISOString().split('T')[0];

      // Reset invalid checkout date
      if (this.checkOutDate && this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = '';
      }
    }
  }

  // Fetch cities for destination dropdown
  fetchLocations(): void {
    fetch('http://localhost:8066/api/locations/all')
      .then((res) => res.json())
      .then((data) => {
        this.locations = data;
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }


  // Fetch hotels for selected city
  onSearchHotels(): void {
    if (!this.selectedCity || !this.checkInDate || !this.checkOutDate || !this.guestCount) {
      alert('Please select a destination, check-in, check-out dates and guests.');
      return;
    }

    this.router.navigate(['/search-results'], {
      queryParams: {
        city: this.selectedCity,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
      },
    });
  }

  onReserve(hotel: Hotel): void {
    this.router.navigate(['/hotel-details', hotel.id]);
  }

  onAiSearch(): void {
    if (!this.aiSearchQuery) {
      alert('Please enter a search query.');
      return;
    }

    this.aiSearchService.search(this.aiSearchQuery).subscribe({
      next: (hotelIds) => {
        this.router.navigate(['/search-results'], {
          queryParams: {
            hotelIds: hotelIds.join(','),
          },
        });
      },
      error: (error) => {
        console.error('Error during AI search:', error);
        alert('An error occurred during the AI search. Please try again.');
      },
    });
  }

  toggleMic(): void {
    // Initialize recognition on first use
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('SpeechRecognition API not supported in this browser.');
      return;
    }

    if (!this.recognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.ngZone.run(() => {
          this.aiSearchQuery = transcript;
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        this.ngZone.run(() => {
          alert('Speech recognition error: ' + (event.error || 'unknown'));
          this.recognitionStarting = false;
          this.recognitionStarted = false;
          this.isRecording = false;
        });
      };

      this.recognition.onstart = () => {
        // Fired when the recognition actually begins listening
        this.ngZone.run(() => {
          this.recognitionStarting = false;
          this.recognitionStarted = true;
          this.isRecording = true;
        });
      };

      this.recognition.onend = () => {
        // Fired when the recognition stops (natural end or stop())
        this.ngZone.run(() => {
          this.recognitionStarting = false;
          this.recognitionStarted = false;
          this.isRecording = false;
        });
      };
    }

    // If recognition is currently running, stop it.
    if (this.recognitionStarted) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition', e);
        // attempt abort as fallback if available
        try {
          if (typeof this.recognition.abort === 'function') {
            (this.recognition as any).abort();
          }
        } catch (err) {
          console.error('Abort also failed', err);
        }
      }
      return;
    }

    // If recognition is in the process of starting, request stop to ensure single-click stop
    if (this.recognitionStarting) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition while starting', e);
      }
      return;
    }

    // Otherwise start recognition and set starting flag; onstart will flip isRecording
    try {
      this.recognitionStarting = true;
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start recognition', e);
      this.recognitionStarting = false;
    }
  }

  // Modal controls
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  // Login
  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const { username, password } = loginForm.value;

      this.userService.loginUser(username, password).subscribe({
        next: (response) => {
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }

          this.successMessage = 'Login successful!';
          this.router.navigate(['/user/dashboard']).then(() => window.location.reload());
          this.closeLoginModal();
          loginForm.reset();
        },
        error: (userError: HttpErrorResponse) => {
          // Try admin login if user fails
          this.adminService.loginAdmin(username, password).subscribe({
            next: () => {
              localStorage.setItem('admin', JSON.stringify({ username }));
              localStorage.setItem('role', 'admin');

              this.successMessage = 'Admin login successful!';
              this.router.navigate(['/admin/dashboard']).then(() => window.location.reload());
              this.closeLoginModal();
              loginForm.reset();
            },
            error: () => {
              this.errorMessage = 'Invalid Credentials for both Customer and Admin.';
              alert(this.errorMessage);
            }
          });
        }
      });
    }
  }

  // Register
onRegisterSubmit(registerForm: NgForm) {
  if (registerForm.valid) {
    this.userService.registerUser(registerForm.value).subscribe({
      next: (response) => {
        // ✅ Store user if present
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', 'user');
        }

        // ✅ Display backend message (which confirms email was sent)
        this.successMessage = response.message || 'Registration successful!';
        this.registrationSuccess = true;

        this.closeRegisterModal();
        registerForm.reset();

        setTimeout(() => {
          this.registrationSuccess = false;
          this.openLoginModal();
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Error registering user';
        }
        alert(this.errorMessage);
      }
    });
  }
}
}