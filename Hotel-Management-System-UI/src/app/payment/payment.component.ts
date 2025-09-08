import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../user.service';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AppUserNavbarComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentForm: FormGroup;
  roomTitle: string = '';
  totalAmount: number = 0;
  paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];
  isProcessing: boolean = false;
  selectedPaymentMethod: string = '';
  bookingDetails: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  private http: HttpClient,
  private cd: ChangeDetectorRef,
  private userService: UserService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      upiId: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCVV: [''],
      netBankingBank: ['']
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.bookingDetails = navigation.extras.state['booking'];
    }
  }

  ngOnInit(): void {
    if (this.bookingDetails) {
      this.roomTitle = this.bookingDetails.roomTitle || 'Selected Room';
      this.totalAmount = this.bookingDetails.price || 0;
    } else {
      alert('Booking details not found. Please try again.');
      this.router.navigate(['/landing-page']);
    }

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((method: string) => {
      this.selectedPaymentMethod = method;
      this.clearFields();
    });
  }

  clearFields(): void {
    this.paymentForm.patchValue({
      upiId: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      netBankingBank: ''
    });
  }

  onPaymentSubmit() {
    if (this.paymentForm.invalid) {
      alert('Please select a valid payment method and fill required fields.');
      return;
    }

  this.isProcessing = true;

    const userString = localStorage.getItem('user');
    let user: any = null;

    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (!user || !user.email || !user.id) {
      alert('User info is missing. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    // Attach user and payment info to bookingDetails for backend
    this.bookingDetails.user = {
      id: user.id,
      email: user.email
    };

    this.bookingDetails.paymentMethod = this.paymentForm.value.paymentMethod;
    this.bookingDetails.totalAmount = this.totalAmount;

    const paymentPayload = {
      bookingDetails: this.bookingDetails,
      paymentMethod: this.paymentForm.value.paymentMethod,
      upiId: this.paymentForm.value.upiId,
      cardNumber: this.paymentForm.value.cardNumber,
      cardExpiry: this.paymentForm.value.cardExpiry,
      cardCVV: this.paymentForm.value.cardCVV,
      netBankingBank: this.paymentForm.value.netBankingBank,
      totalAmount: this.totalAmount
    };

    // Simulate payment API
    this.http.post('http://localhost:8066/api/payment/upipayment', paymentPayload, { responseType: 'text' })
      .subscribe({
        next: () => {
          alert('Payment successful! Booking now...');

          // Send booking (with email, paymentMethod, totalAmount) to reserve endpoint
          this.userService.reserveRoom(this.bookingDetails).subscribe({
            next: (response: any) => {
              // The backend returns plain text; try to parse if it's JSON-like
              try {
                const parsed = typeof response === 'string' ? JSON.parse(response) : response;
                alert(parsed.message || 'Room booked and email sent successfully!');
              } catch {
                alert(response || 'Room booked and email sent successfully!');
              }
              this.isProcessing = false;
              this.cd.detectChanges();
              this.router.navigate(['/landing-page']);
            },
            error: (err) => {
              alert('Booking failed after payment. Please contact support.');
              console.error(err);
              this.isProcessing = false;
              this.cd.detectChanges();
            }
          });
        },
        error: (err) => {
          alert('Payment failed. Booking not attempted.');
          console.error(err);
          this.isProcessing = false;
        }
      });
  }
}
