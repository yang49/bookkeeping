import {Component, OnInit} from '@angular/core';
// import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {PaymentService} from '../services/payment.service';
// import {MatSnackBar} from '@angular/material/snack-bar';
// import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public userName: any;
  public profile: any;
  public currentCard = '';

  public qrcode: any;
  public currentCredit = 0;
  public topUpAmount = 0;
  public withdrawAmount = 0;
  public showTopUpTab = true;
  public showWithdrawTab = true;
  public showTransactionTab = true;
  public transactionEmpty = true;
  public transactionHistoryEmptyMsg = '';
  public transactionHistory: any;

  public withdrawForm: FormGroup;

  // public checkBalanceValidator: ValidatorFn;

  constructor(
    // private userService: UserService,
    // private paymentService: PaymentService,
    // private cookieService: CookieService,
    // private bottomSheet: MatBottomSheet,
    private formBuilder: FormBuilder,
    // private snackBar: MatSnackBar,
    private router: Router
  ) {
    // this.checkBalanceValidator = (control: FormGroup): ValidationErrors | null => {
    //   const currentCredit = this.currentCredit;
    //   const withdrawAmount = control.get('withdrawAmount').value;
    //   return currentCredit >= withdrawAmount ? null : {inputsInvalid: true};
    // };

    this.withdrawForm = this.formBuilder.group({
        withdrawAmount: ['', Validators.compose([
          Validators.min(10),
          Validators.required
        ])]
      }
      //, {validators: [this.checkBalanceValidator]}
    );
  }

  ngOnInit() {
    this.transactionEmpty = true;
    this.transactionHistory = [];
    this.showTopUpTab = false;
    this.showWithdrawTab = false;
    this.showTransactionTab = false;
    this.currentCard = 'userProfile';
    // this.userService.isLoggedIn().subscribe((status) => {
    //   if (!status) {
    //     this.router.navigateByUrl('/login');
    //   }
    // });
    // this.userService.getQRCode().subscribe((result: any) => {
    //   this.qrcode = result.data;
    // });
    // const accountObject = JSON.parse(this.cookieService.get('account'));
    // if (accountObject.profile) {
    //   this.userName = accountObject.profile.userName;
    // } else {
    //   this.userName = accountObject.userName;
    // }
    // this.userService.getAccount().subscribe((profile) => {
    //   this.profile = profile;
    // });
    // this.userService.getCredit().subscribe((result: any) => {
    //   this.currentCredit = Number((result.credit).toFixed(2));
    // });
  }

  editUserProfile(): void {
    this.router.navigate(['user-profile/editProfile']);
  }

  authApply(): void {
    this.router.navigate(['user-profile/authApply']);
  }

  showOverview(): void {
    this.router.navigate(['user-profile/overview']);
  }


  topUp(): void {
    // this.paymentService.topUpCredit(this.topUpAmount).subscribe((res: any) => {
    //   // this.currentCredit = res.credit;
    //   const stripe = Stripe('pk_live_b35rqulyqt3vobRfbxi6iRWa00DkLBZDc2');
    //   stripe.redirectToCheckout({sessionId: res.id}).then((result) => {
    //     // If `redirectToCheckout` fails due to a browser or network
    //     // error, display the localized error message to your customer
    //     // using `result.error.message`
    //   });
    //   this.snackBar.open('If no redirect, please contact admin', 'Close', {
    //     duration: 3000
    //   });
    // });
  }

  withdraw(): void {
    // this.userService.withdraw(this.withdrawForm.get('withdrawAmount').value).subscribe((res: any) => {
    //   this.currentCredit = res.credit;
    // });
  }

  displayWithdrawTab(): void {
    this.showWithdrawTab = !this.showWithdrawTab;
    this.showTopUpTab = false;
    this.showTransactionTab = false;
  }

  displayTopUpTab(): void {
    this.showTopUpTab = !this.showTopUpTab;
    this.showWithdrawTab = false;
    this.showTransactionTab = false;
  }

  displayTransactionHistory(): void {
    this.showWithdrawTab = false;
    this.showTopUpTab = false;
    this.showTransactionTab = !this.showTransactionTab;
    // if (this.showTransactionTab) {
    //   this.userService.getTransactionHistory().subscribe((transactions) => {
    //     if ( transactions === []) {
    //       this.transactionEmpty = true;
    //       this.transactionHistoryEmptyMsg = 'EMPTY_TRANSACTION';
    //     } else {
    //       this.transactionEmpty = false;
    //       for ( let i = 0; i < Object.keys(transactions).length; i++) {
    //         transactions[i].date = moment(transactions[i].date).format('MMMM Do YYYY, h:mm:ss a');
    //       }
    //       this.transactionHistory = transactions;
    //     }
    //   });
    // }
  }

  switchCards(card: any): void {
    this.currentCard = card;
  }
}
