import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() {
  }

  public getNumberOfMonths(): Observable<number> {
    // Salesforce joined date (ISO format to avoid locale ambiguity)
    const joinedDate = new Date('2025-11-03');
    const currentDate = new Date();
    const difference = currentDate.getTime() - joinedDate.getTime();
    const days = difference / (1000 * 3600 * 24);
    const temp = (days / 30);
    const years = (temp / 12);
    return of(Number(years.toFixed(2)));
  }
}
