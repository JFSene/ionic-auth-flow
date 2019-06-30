import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  userEmail: string;
  
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private storage: Storage
  ) {}

  ngOnInit(){
    let test01;
    this.storage.get('USER_INFO').then((val) => {
      test01 = val
      this.authService.getUserDetails(test01)
        pipe(map(res => {
          console.log(res);
          return res;
        }));
      console.log(test01);
    })
    
    // if(this.authService.userDetails()){
    //   this.userEmail = this.authService.userDetails().email;
    // }else{
    //   this.navCtrl.navigateBack('');
    // }
  }

  logout(){
    // this.authService.logoutUser()
    // .then(res => {
    //   console.log(res);
    //   this.navCtrl.navigateBack('');
    // })
    // .catch(error => {
    //   console.log(error);
    // })
  }
}