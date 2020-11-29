import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { OrderScreenComponent } from './client/order-screen/order-screen.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderModeGuard } from './guards/order-mode.guard';
import { LandingPageComponent } from './public-pages/landing-page/landing-page.component';
import { RegisterComponent } from './public-pages/register/register.component';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  // { path: 'login', component: LandingPageComponent },
  { path: 'shopping', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: OrderScreenComponent, canActivate: [AuthGuard, OrderModeGuard] },
  { path: '', pathMatch: 'full', component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
  providers: [AuthGuard, OrderModeGuard],
})
export class AppRoutingModule { }
