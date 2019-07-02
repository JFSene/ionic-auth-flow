import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute } from "@angular/router";
import { NavigationExtras } from '@angular/router';
import { Balance } from '../../models/balance';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public user: string;
  public userModel: User;


  constructor(
    private authService: AuthenticationService,
    private storageService: StorageService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ionViewDidEnter() {
    // this.storageService.getItems().then(items => {
    //   this.userModel = items;
    //   this.user = this.userModel.data.name;  
    // });

    this.route.queryParams.subscribe(params => {
      this.userModel = JSON.parse(params["userData"]);
      this.userModel.data.auth = {};
      console.log(this.userModel);
    });
    console.log(this.userModel);
  }
  ngOnInit(){ 
    // console.log(this.userModel);
    // this.route.queryParams.subscribe(params => {
    //   this.userModel = JSON.parse(params["userData"]);
    // });
  }

  logout(){
    this.authService.logout()
    .then(res => {
      this.storageService.deleteItem(this.userModel.data.uid);
        this.navCtrl.pop();
      })
      .catch(error => {
        console.log(error);
      })
  }

  // NAVIGATION
  showBalance(userBalance: Balance) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        userBalance: JSON.stringify(userBalance)
      }
  };
    this.navCtrl.navigateForward(['balance'], navigationExtras);
  }
  
}