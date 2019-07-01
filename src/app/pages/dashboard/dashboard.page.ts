import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public balance: string;
  public user: string;


  constructor(
    private storage: Storage,
    private acitvatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {
    
  }

  ngOnInit(){
    this.balance = this.numberToReal(Number(this.acitvatedRoute.snapshot.paramMap.get('balance')));
    this.user = this.acitvatedRoute.snapshot.paramMap.get('name');
  }

  logout(){
    this.authService.logout()
    .then(res => {
        console.log(res);
        this.navCtrl.pop();
      })
      .catch(error => {
        console.log(error);
      })
  }

  public async getValues(name, value){
    return await `${name}: ${this.storage.get(value)}`;
  }

  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}
}