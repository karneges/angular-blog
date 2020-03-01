import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponse, User } from '../../../shared/interfaces';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  public error$: string;
  get token(): string {
    const expData = new Date(localStorage.getItem('fb-token-expiresIn'));
    if (new Date() > expData) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap(this.setToken),
        catchError(err => this.handleError(err))
      );
  }
  logout() {
    this.setToken(null);
  }
  //   handleError(error: HttpErrorResponse) {
  // //     const { message } = error.error.error;
  // //     switch (message) {
  // //   case 'EMAIL_NOT_FOUND':
  // //     this.error$.next('Не существующий email');
  // //     break;
  // //   case 'INVALID_EMAIL':
  // //     this.error$.next('Неверный email');
  // //     break;
  // //   case 'INVALID_PASSWORD':
  // //     this.error$.next('Неверный пароль');
  // //     break;
  // // }
  // //     console.log(message);
  // //
  // //     return throwError(error);
  // //   }
  handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$ = 'Не существующий email';
        break;
      case 'INVALID_EMAIL':
        this.error$ = 'Неверный email';
        break;
      case 'INVALID_PASSWORD':
        this.error$ = 'Неверный пароль';
        break;
    }
    console.log(message);

    return throwError(error);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(res: FbAuthResponse | null) {
    if (res) {
      const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
      localStorage.setItem('fb-token', res.idToken);
      localStorage.setItem('fb-token-expiresIn', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
