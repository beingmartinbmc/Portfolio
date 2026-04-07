import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CONTACT_LINKS} from '../../config/profile-links';
import {environment} from '../../../environments/environment';
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

  async onSubmit(name: string, subject: string, email: string, message: string) {
    if (!this.isFormValid()) {
      this.showToastNotification('Please fill in all fields', 'error');
      return;
    }

    if (!this.isEmailValid()) {
      this.showToastNotification('Please enter a valid email address', 'error');
      return;
    }

    this.isSubmitting = true;

    if (!environment.web3FormsAccessKey) {
      this.isSubmitting = false;
      this.showToastNotification(`Contact form is not configured right now. Please email me at ${CONTACT_LINKS.email}.`, 'error');
      return;
    }

    const formData = new FormData();
    formData.append('access_key', environment.web3FormsAccessKey);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        this.showToastNotification(`Failed to send message: ${data?.message ?? 'Please try again.'}`, 'error');
        return;
      }

      this.marioJumping = true;
      this.showToastNotification('Message sent successfully! I\'ll get back to you soon.');

      setTimeout(() => {
        this.resetForm();
      }, 1000);

      setTimeout(() => {
        this.marioJumping = false;
      }, 2400);
    } catch (error) {
      console.error('Form submission failed:', error);
      this.showToastNotification(`Contact service is unreachable right now. Please email me at ${CONTACT_LINKS.email}.`, 'error');
    } finally {
      this.isSubmitting = false;
    }
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
