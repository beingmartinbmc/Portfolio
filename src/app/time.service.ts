import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() {
  }

  public getNumberOfMonths(): Observable<number> {
    const joinedDate = new Date('05/26/2021');
    const currentDate = new Date();
    const difference = currentDate.getTime() - joinedDate.getTime();
    const days = difference / (1000 * 3600 * 24);
    const temp = (days / 30);
    return of(Number(temp.toFixed(2)));
  }
}
