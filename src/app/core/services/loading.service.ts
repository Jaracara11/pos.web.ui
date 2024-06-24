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

  set setLoadingState(isLoading: boolean) {
    this._loadingSubject$.next(isLoading);
  }
}


