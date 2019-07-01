import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { pipe, Subject, throwError, BehaviorSubject } from 'rxjs';
import { Balance } from '../models/balance';
import { Auth } from '../models/auth';

const TOKEN_KEY: string = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  error = new Subject<string>();
  authenticationState = new BehaviorSubject(false);
  url = "https://smo.banking.homologa.bititecnologia.com.br/api/v2";

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private plt: Platform
    ) { 
      this.plt.ready().then(() => {
        this.checkToken();
      });
    }

    checkToken() {
      this.storage.get(TOKEN_KEY).then(res => {
        if (res) {
          this.authenticationState.next(true);
        }
      })
    }

  authenticateUser(value) {
    let RELATIVE_PATH = "auth/sign_in";
    let postData = {
      "account": value.account,
      "password": value.password,
      "holder": value.holder
    };
    return this.http.post<any>(
        `${this.url}/${RELATIVE_PATH}`, 
        postData, 
        {observe: 'response' as 'body'}
      )
    .pipe(map(user => {
      var accessToken = user.headers.get('access-token');
      this.storage.set(TOKEN_KEY, accessToken).then(() => {
        this.authenticationState.next(true);
      });
      return user;
    })
    );
  }

  getUserDetails(auth: Auth) {
    let RELATIVE_PATH = "user/balance";
    
      return this.http.get<Balance>(
        `${this.url}/${RELATIVE_PATH}`, 
      {
        headers: new HttpHeaders({ 
          'uid': auth.uid,
          'client': auth.client,
          'access-token': auth.accessToken
         })
      })
      .pipe(
        map(responseData => {
          console.log(responseData);
          const balance: Balance = responseData;
          return balance;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
