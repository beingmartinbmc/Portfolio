import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ContactComponent implements OnInit {

  model: any = {};

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onSubmit(name, subject, email, message) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post('https://formspree.io/f/mbjpqzgz',
      {name, subject, replyto: email, message},
      {headers}).subscribe(
      response => {
        console.log(response);
      }
    );
  }
}
