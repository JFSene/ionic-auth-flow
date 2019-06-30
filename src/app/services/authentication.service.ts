import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = "https://smo.banking.homologa.bititecnologia.com.br/api/v2";

  constructor(
    private http: HttpClient,
    private storage: Storage
    ) { }

  authenticateUser(value) {
    let RELATIVE_PATH = "auth/sign_in";
    let postData = {
      "account": value.account,
      "password": value.password,
      "holder": value.holder
    };
    return this.http.post<any>(`${this.url}/${RELATIVE_PATH}`, postData, {observe: 'response' as 'body'})
    .pipe(map(user => {
      console.log(user.headers);
      console.log("=================================");
      console.log("UID:" ,user.headers.get('uid'));
      console.log("Client:" ,user.headers.get('client'));
      console.log("Access-Token:" ,user.headers.get('access-token'));
      var headerResponse = {
        uid: user.headers.get('uid'),
        client: user.headers.get('client'),
        accessToken: `Bearer ${user.headers.get('access-token')}`,
      }
      this.storage.set('USER_INFO',headerResponse).then();
      console.log(headerResponse);
      console.log(this.storage.get('USER_INFO'));
      return user;
    }));
  }

  getUserDetails(value) {
    let RELATIVE_PATH = "user/balance";

      return this.http.get(`${this.url}/${RELATIVE_PATH}`, {headers: value} ).subscribe(res => {
        console.log(res);
      }, 
      err => {
        console.log(err);
      })
  }

}
