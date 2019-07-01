import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { Auth } from '../../models/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  providers: [ ],
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
    private loadingController: LoadingController,
    private storageService: StorageService,
    private toastController: ToastController
  ) { }
  
  // Views Lifecycle
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
          console.log("USER");
          console.log(this.user.data);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.log("HEADERS");
          console.log(auth);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
          this.getBalance(auth, this.user);
          this.errorMessage = "";
        }, 
        err => {
          this.errorHandler(err.error.errors);
        });
  }

  getBalance(auth: Auth, userData: User) {
    this.authService.getUserDetails(auth).subscribe(balance => {
      console.log("BALANCE");
      console.log(balance);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      userData.data.auth = auth;
      userData.data.balance = balance
      this.addItem(userData)
    }, 
    err => {
      console.log(err);
      console.log(err.error);
      console.log(err.error.errors);
      this.errorHandler(err.error.errors);
    });
  }

  // CREATE
  addItem(user: User) {
    this.storageService.addItem(user).then(item => {
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(`User is saved: ${user.data}`);
      this.goToRegisterPage(user);
    });
  }
 
  //Navigation
  goToRegisterPage(userData: User){
    this.hideLoader();
    this.navCtrl.navigateForward(`dashboard/${userData.data.balance.balance}/${userData.data.name}`)
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

  //ERROR HANDLER
  errorHandler(msg) {
    this.errorMessage = msg;
      this.showToast(this.errorMessage);
      this.validations_form.reset();
      console.log(msg);
      this.hideLoader();
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

   // Helper
   async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      position: "middle"
    });
    toast.present();
  }

  hideLoader() {
    this.loadingController.dismiss();
}

//UNSUB error
ngOnDestroy() {
  this.errorSub.unsubscribe();
}
 
}