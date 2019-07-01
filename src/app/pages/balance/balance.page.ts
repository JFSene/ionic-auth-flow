import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { StorageService } from '../../services/storage.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Balance } from 'src/app/models/balance';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {

  public userModel: User;
  balance:        string;
  limit:          string;
  availableLimit: string;
  blockedAmount:  string;


  constructor(
    private authService: AuthenticationService,
    private storageService: StorageService
  ) { }

  ionViewDidEnter() {
    this.storageService.getItems().then(items => {
      this.userModel = items; 
      console.log(this.userModel.data.balance);
      this.balance = this.numberToReal(Number(this.userModel.data.balance.balance));
      this.limit = this.numberToReal(Number(this.userModel.data.balance.limit));
      this.availableLimit = this.numberToReal(Number(this.userModel.data.balance.available_limit));
      this.blockedAmount = this.numberToReal(Number(this.userModel.data.balance.blocked_amount));
    });
    
  }

  ngOnInit() {
  }


  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }
}
