import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Balance } from 'src/app/models/balance';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {

  public userBalance: Balance;
  balance:        string;
  limit:          string;
  availableLimit: string;
  blockedAmount:  string;


  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute
  ) { }

    ionViewWillEnter() {
      this.route.queryParams.subscribe(params => {
        this.userBalance = JSON.parse(params["userBalance"]);
        this.balance = this.numberToReal(Number(this.userBalance.balance));
        this.limit = this.numberToReal(Number(this.userBalance.limit));
        this.availableLimit = this.numberToReal(Number(this.userBalance.available_limit));
        this.blockedAmount = this.numberToReal(Number(this.userBalance.blocked_amount));
        console.log(this.userBalance);
      });
      console.log(this.userBalance);
    }
  ionViewDidEnter() {
    // this.storageService.getItems().then(items => {
    //   this.userModel = items; 
    //   console.log(this.userModel.data.balance);
    //   this.balance = this.numberToReal(Number(this.userModel.data.balance.balance));
    //   this.limit = this.numberToReal(Number(this.userModel.data.balance.limit));
    //   this.availableLimit = this.numberToReal(Number(this.userModel.data.balance.available_limit));
    //   this.blockedAmount = this.numberToReal(Number(this.userModel.data.balance.blocked_amount));
    // });
    
  }

  ngOnInit() {
  }


  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }
}
