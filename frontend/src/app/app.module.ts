import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {
//   MatAutocompleteModule,
//   MatBottomSheetModule,
//   MatButtonModule,
//   MatCheckboxModule,
//   MatDialogModule,
//   MatExpansionModule,
//   MatFormFieldModule,
//   MatIconModule,
//   MatInputModule,
//   MatListModule,
//   MatNativeDateModule,
//   MatProgressSpinnerModule,
//   MatSelectModule,
//   MatSlideToggleModule,
//   MatSnackBarModule,
//   MatTabsModule
// } from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(private readonly translate: TranslateService) {
  //   translate.setDefaultLang(translate.getBrowserLang());
  // }
}

// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
