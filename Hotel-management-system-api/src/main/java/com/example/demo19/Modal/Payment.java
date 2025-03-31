package com.example.demo19.Modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment")
public class Payment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

    
    private Double amount;
    private String paymentMethod;
    private String upiId;
    private String cardNumber;
    private String cardExpiry;
    private String cardCVV;
    private String netBankingBank;
   



    // Constructor with parameters (optional)
    public Payment(Long bookingId, Double amount, String paymentMethod, String upiId, String cardNumber, String expiryDate, String cvv) {
        
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.upiId = upiId;
        this.cardNumber = cardNumber;
        this.cardExpiry = expiryDate;
        this.cardCVV = cvv;
    }



	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	


	public Double getAmount() {
		return amount;
	}



	public void setAmount(Double amount) {
		this.amount = amount;
	}



	public String getPaymentMethod() {
		return paymentMethod;
	}



	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}



	public String getUpiId() {
		return upiId;
	}



	public void setUpiId(String upiId) {
		this.upiId = upiId;
	}



	public String getCardNumber() {
		return cardNumber;
	}



	public void setCardNumber(String cardNumber) {
		this.cardNumber = cardNumber;
	}



	public String getCardExpiry() {
		return cardExpiry;
	}



	public void setCardExpiry(String cardExpiry) {
		this.cardExpiry = cardExpiry;
	}



	public String getCardCVV() {
		return cardCVV;
	}



	public void setCardCVV(String cardCVV) {
		this.cardCVV = cardCVV;
	}



	public String getNetBankingBank() {
		return netBankingBank;
	}



	public void setNetBankingBank(String netBankingBank) {
		this.netBankingBank = netBankingBank;
	}



	
	
    
}
