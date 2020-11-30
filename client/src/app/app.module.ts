import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchPasswordValidatorDirective } from './directives/match-password-validator.directive';
import { UniqueIdValidatorDirective } from './directives/unique-id-validator.directive';
import { HighlightPipe } from './pipes/highlight.pipe';
import { HeaderComponent } from './components/layout/header/header.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { CartTableComponent } from './components/cart-table/cart-table.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { OrderScreenComponent } from './components/order-screen/order-screen.component';
import { AmountPopupComponent } from './components/popups/amount-popup/amount-popup.component';
import { ReceiptPopupComponent } from './components/popups/receipt-popup/receipt-popup.component';
import { ProductsNavbarComponent } from './components/products-navbar/products-navbar.component';
import { RegisterComponent } from './components/authentication/register/register.component';

@NgModule({
  declarations: [
    HighlightPipe,
    MatchPasswordValidatorDirective,
    UniqueIdValidatorDirective,
    AppComponent,
    CartTableComponent,
    EditProductComponent,
    AllProductsComponent,
    AmountPopupComponent,
    ReceiptPopupComponent,
    RegisterComponent,
    OrderScreenComponent,
    ProductsNavbarComponent,
    LoginComponent,
    LandingPageComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    JwtModule.forRoot({
			config: {
				tokenGetter: () =>  { 
          return localStorage.getItem('token');
          } 
			},
		}),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatToolbarModule,
    AppRoutingModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatTooltipModule,
  ],
  entryComponents: [AmountPopupComponent, ReceiptPopupComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
