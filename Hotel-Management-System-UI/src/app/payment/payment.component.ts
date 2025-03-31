import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  paymentForm: FormGroup;
  roomTitle: string = '';
  totalAmount: number = 0;
  paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];
  isProcessing: boolean = false;
  selectedPaymentMethod: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient   // ✅ Inject HttpClient for API calls
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      upiId: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCVV: [''],
      netBankingBank: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: string; }) => {
      this.roomTitle = params['roomTitle'] || 'Selected Room';
      this.totalAmount = params['price'] ? parseFloat(params['price']) : 0;
    });

    // Listen for changes in payment method
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
  
  onPaymentSubmit(){
    console.log("HIiiiiiiiiiiii");
    console.log(this.paymentForm.value);
    this.http.post('http://localhost:8066/api/payment/upipayment', this.paymentForm.value, { responseType: 'text' }).subscribe({
      next: (data) => {
        console.log("Success");
        alert(data);
      },
      error: (err) => {
        alert("API Failure");
      },
    });



  } 



}