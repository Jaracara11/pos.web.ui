import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingSubject$ = new BehaviorSubject<boolean>(false);

  get getLoadingState() {
    return this._loadingSubject$.asObservable();
  }

  setLoadingState(isLoading: boolean): void {
    this._loadingSubject$.next(isLoading);
  }
}