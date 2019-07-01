import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

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
    private navCtrl: NavController
  ) {
    
  }
  ionViewDidEnter() {
    this.storageService.getItems().then(items => {
      this.userModel = items;
      this.user = this.userModel.data.name;  
    });
  }
  ngOnInit(){ }

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
  showBalance() {
    this.navCtrl.navigateForward('balance');
  }
  
}