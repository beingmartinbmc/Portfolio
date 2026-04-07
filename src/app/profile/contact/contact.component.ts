import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CONTACT_LINKS} from '../../config/profile-links';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ContactComponent {

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
  marioJumping = false;

  constructor(private http: HttpClient) {}

  isFormValid(): boolean {
    return this.model.name?.trim() !== '' && 
           this.model.email?.trim() !== '' && 
           this.model.subject?.trim() !== '' && 
           this.model.message?.trim() !== '';
  }

  isEmailValid(): boolean {
    if (!this.model.email?.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.model.email.trim());
  }

  showToastNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 8000);
  }

  onSubmit(name: string, subject: string, email: string, message: string) {
    if (!this.isFormValid()) {
      this.showToastNotification('Please fill in all fields', 'error');
      return;
    }

    if (!this.isEmailValid()) {
      this.showToastNotification('Please enter a valid email address', 'error');
      return;
    }

    this.isSubmitting = true;

    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    this.http.post(CONTACT_LINKS.formspree,
      {name, subject, replyto: email, message},
      {headers}).subscribe(
      response => {
        this.isSubmitting = false;
        this.marioJumping = true;
        this.showToastNotification('Message sent successfully! I\'ll get back to you soon.');
        
        setTimeout(() => {
          this.resetForm();
        }, 1000);

        setTimeout(() => {
          this.marioJumping = false;
        }, 2400);
      },
      error => {
        console.error('Form submission failed:', error);
        this.isSubmitting = false;
        if (error.status === 0) {
          this.showToastNotification(`Contact service is unreachable right now. Please email me at ${CONTACT_LINKS.email}.`, 'error');
          return;
        }

        this.showToastNotification('Failed to send message. Please try again.', 'error');
      }
    );
  }

  resetForm() {
    this.model = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    if (this.contactForm) {
      this.contactForm.resetForm();
    }
    
  }
}
