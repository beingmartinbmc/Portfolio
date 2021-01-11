import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  model: any = {};

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit() {
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
