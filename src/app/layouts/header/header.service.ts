import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isSearchHiddenSubject = new BehaviorSubject<boolean>(false);
  isSearchHidden$: Observable<boolean> =
    this.isSearchHiddenSubject.asObservable();

  setSearchHidden(isHidden: boolean): void {
    this.isSearchHiddenSubject.next(isHidden);
  }
}
