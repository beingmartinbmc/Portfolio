import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ContactComponent implements OnInit {

  @ViewChild('contactForm') contactForm!: NgForm;

  model: any = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showToast = false;
  toastMessage = '';
  toastType = 'success';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  // Check if all fields are filled
  isFormValid(): boolean {
    return this.model.name?.trim() !== '' && 
           this.model.email?.trim() !== '' && 
           this.model.subject?.trim() !== '' && 
           this.model.message?.trim() !== '';
  }

  // Check if email is valid
  isEmailValid(): boolean {
    if (!this.model.email?.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.model.email.trim());
  }

  // Show toast notification
  showToastNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Hide toast after 8 seconds (increased significantly)
    setTimeout(() => {
      this.showToast = false;
    }, 8000);
  }

  onSubmit(name: string, subject: string, email: string, message: string) {
    console.log('Form submission triggered');
    console.log('Form data:', { name, subject, email, message });
    console.log('Model data:', this.model);
    console.log('Is form valid:', this.isFormValid());
    console.log('Is email valid:', this.isEmailValid());

    // Validate all fields
    if (!this.isFormValid()) {
      console.log('Form validation failed - missing fields');
      this.showToastNotification('Please fill in all fields', 'error');
      return;
    }

    // Validate email format
    if (!this.isEmailValid()) {
      console.log('Email validation failed');
      this.showToastNotification('Please enter a valid email address', 'error');
      return;
    }

    console.log('All validations passed, submitting form...');
    this.isSubmitting = true;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post('https://formspree.io/f/mbjpqzgz',
      {name, subject, replyto: email, message},
      {headers}).subscribe(
      response => {
        console.log('Form submission successful:', response);
        this.isSubmitting = false;
        this.showToastNotification('Message sent successfully! I\'ll get back to you soon.');
        
        // Reset form after a short delay to ensure toast is visible
        setTimeout(() => {
          this.resetForm();
        }, 1000);
      },
      error => {
        console.error('Form submission failed:', error);
        this.isSubmitting = false;
        this.showToastNotification('Failed to send message. Please try again.', 'error');
      }
    );
  }

  // Reset form method
  resetForm() {
    // Reset the model
    this.model = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    // Reset the form state to clear validation errors
    if (this.contactForm) {
      this.contactForm.resetForm();
    }
    
    console.log('Form reset completed');
  }
}
