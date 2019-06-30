import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';

import { LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  providers: [ AuthenticationService ],
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  validations_form: FormGroup;
  errorMessage: string = '';
  loaderToShow: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController
  ) { }
 
  ngOnInit() {
 
    this.validations_form = this.formBuilder.group({
      account: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(5)
      ])),
      holder: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
    });
  }
 
 
  validation_messages = {
    'account': [
      { type: 'required', message: 'Account is required.' },
      { type: 'pattern', message: 'Please enter a 4 digit account.' }
    ],
    'holder': [
      { type: 'required', message: 'Holder is required.' },
      { type: 'pattern', message: 'Please enter the holder number.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' }
    ]
  };
 
 
  loginUser(value){
    console.log(value);
    this.showLoader();

    this.authService.authenticateUser(value)
      .pipe(first())
      .subscribe(
        (res: HttpResponse<any>) => {
          this.hideLoader();
          this.errorMessage = "";
          this.navCtrl.navigateForward('/dashboard')
          console.log("+++++++++++++++++++++++++++++++++");
          console.log(res.body);
        }, 
        err => {
          this.errorMessage = err.message;
        });
  }
 
  goToRegisterPage(){
    this.navCtrl.navigateForward('/register');
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'This Loader will Not AutoHide',
      spinner: "lines"
    }).then((res) => {
      res.present();
 
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
  }

  hideLoader() {
    this.loadingController.dismiss();
}
 
}