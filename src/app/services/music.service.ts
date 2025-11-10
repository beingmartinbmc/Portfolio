import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private musicPlayingSubject = new BehaviorSubject<boolean>(false);
  public musicPlaying$: Observable<boolean> = this.musicPlayingSubject.asObservable();

  setMusicPlaying(isPlaying: boolean): void {
    this.musicPlayingSubject.next(isPlaying);
  }

  getMusicPlayingState(): boolean {
    return this.musicPlayingSubject.value;
  }
}
