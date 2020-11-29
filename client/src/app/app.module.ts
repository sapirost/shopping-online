import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllProductsComponent } from './client/all-products/all-products.component';
import { CartTableComponent } from './client/cart-table/cart-table.component';
import { HomeComponent } from './client/home/home.component';
import { OrderScreenComponent } from './client/order-screen/order-screen.component';
import { AmountPopupComponent } from './client/popups/amount-popup/amount-popup.component';
import { ReceiptPopupComponent } from './client/popups/receipt-popup/receipt-popup.component';
import { ProductsNavbarComponent } from './client/products-navbar/products-navbar.component';
import { MatchPasswordValidatorDirective } from './directives/match-password-validator.directive';
import { UniqueIdValidatorDirective } from './directives/unique-id-validator.directive';
import { HighlightPipe } from './pipes/highlight.pipe';
import { LandingPageComponent } from './public-pages/landing-page/landing-page.component';
import { LoginComponent } from './public-pages/login/login.component';
import { RegisterComponent } from './public-pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    CartTableComponent,
    AddProductComponent,
    EditProductComponent,
    AllProductsComponent,
    AmountPopupComponent,
    ReceiptPopupComponent,
    RegisterComponent,
    HighlightPipe,
    MatchPasswordValidatorDirective,
    UniqueIdValidatorDirective,
    OrderScreenComponent,
    ProductsNavbarComponent,
    LoginComponent,
    LandingPageComponent,
    HomeComponent,
  ],
  imports: [
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
    MatTooltipModule
  ],
  entryComponents: [AmountPopupComponent, ReceiptPopupComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
