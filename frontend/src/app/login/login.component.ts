import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public model: any = {};
  public message: string | undefined;
  public auth2: any;

  public loginForm: FormGroup;
  public onSubmit: boolean | undefined;

  constructor(
    // private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private zone: NgZone,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose(
        [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24)])]
    });
  }


  ngOnInit() {
    this.googleInit();
  }

  getEmailErrorMessage(): void {
    // const formControl = this.loginForm.get('email');
    // return formControl.hasError('required') ? 'ENTER_EMAIL' :
    //   formControl.hasError('email') ? 'INVALID_EMAIL' : '';
  }

  getPasswordErrorMessage(): void {
    // const formControl = this.loginForm.get('password');
    // return formControl.hasError('required') ? 'ENTER_PASSWORD' :
    //   formControl.hasError('minlength') ? 'PASSWORD_MINIMUM_CHARACTERS' :
    //     formControl.hasError('maxLength') ? 'PASSWORD_MAXIMUM_CHARACTERS' : '';
  }

  googleInit(): void {
    // gapi.load('auth2', () => {
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '789067769000-5r8kpsuop86c6jtm8urb8aacaamntpv7.apps.googleusercontent.com',
    //     redirect_uris: ['http://www.zyanzoom.com'],
    //     javascript_origins: ['http://localhost:4200'],
    //     cookiepolicy: 'single_host_origin',
    //     client_secret: 'uJWFa0FPfFXwCcrhhMPUZPOI',
    //     scope: 'profile email'
    //   });
    //   this.attachSignin(document.getElementById('googleBtn'));
    // });
  }

  attachSignin(element: any): void {
    // this.auth2.attachClickHandler(element, {},
    //   (googleUser: { getBasicProfile: () => any; getAuthResponse: () => { (): any; new(): any; access_token: any; }; }) => {
    //
    //     const profile = googleUser.getBasicProfile();
    // this.userService.loginWithSocialAccount(profile.getEmail(),
    //   googleUser.getAuthResponse().access_token)
    //   .then(() => {
    //     this.zone.run(() => {
    //       // this.router.navigateByUrl('/schedule');
    //       this.router.navigateByUrl('/store');
    //     });
    //   }, (response: { status: number; }) => {
    //     if (response.status === 403) {
    //       this.zone.run(() => {
    //         this.router.navigate(['/register'],
    //           {state: {socialProfile: profile, site: 'google'}}
    //         );
    //       });
    //     }
    //   });
    // });
  }

  login(): void {
    // this.onSubmit = true;
    // const valueObject: any = this.loginForm.value;
    // this.userService.login(this.loginForm.get('email').value,
    //   this.loginForm.get('password').value)
    //   .then((res) => {
    //     this.message = 'success';
    //     // to go previous page
    //     // this.router.navigate(['/schedule']);
    //     // window.location.reload();// TODO: Need look for alternatives for sidebar
    //     this.router.navigateByUrl('/store');
    //   }, () => {
    //     this.message = 'error';
    //   });
  }

}
