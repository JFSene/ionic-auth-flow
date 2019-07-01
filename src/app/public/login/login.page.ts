import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController, NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { Auth } from '../../models/auth';
import { Balance } from '../../models/balance';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  providers: [ AuthenticationService ],
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  user: User;
  validations_form: FormGroup;
  errorMessage: string = '';
  private errorSub: Subscription;
  loaderToShow: any;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingController: LoadingController
  ) { }
  
  ionViewWillLeave() {
    this.validations_form.reset();
  }
 
  ngOnInit() {
    this.errorSub = this.authService.error.subscribe(err => {
      this.errorMessage = err;
    });
    this.formValidator();
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
          this.user = res.body;
          var auth: Auth = {
            uid: res.headers.get('uid'),
            client: res.headers.get('client'),
            accessToken: res.headers.get('access-token')
          }
          console.log("User");
          console.log(this.user.data);
          console.log("+++++++++++++++++++++++++++++++++");
          console.log("HEADERS");
          console.log(auth);
          
          this.getBalance(auth, this.user);
          this.errorMessage = "";
        }, 
        err => {
          this.errorMessage = err.error.errors;
          console.log(err.error);
          this.hideLoader();
        });
  }

  getBalance(auth: Auth, userData: User) {
    this.authService.getUserDetails(auth).subscribe(balance => {
      console.log(balance);
      this.goToRegisterPage(userData, balance);
    });
    
  }
 
  //Navigation
  goToRegisterPage(userData: User, balance: Balance){
    this.hideLoader();
    this.navCtrl.navigateForward(`dashboard/${userData.data.name}/${balance.balance}`)
  }

  //FORM VALIDATION
  formValidator() {
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


  //Loading Component
  //TODO: Extract to new Component
  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Autenticando usuário...',
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

//UNSUB error
ngOnDestroy() {
  this.errorSub.unsubscribe();
}
 
}