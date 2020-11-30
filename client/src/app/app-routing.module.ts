import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { OrderScreenComponent } from './components/order-screen/order-screen.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderModeGuard } from './guards/order-mode.guard';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LandingPageComponent },
  { path: 'shopping', component: HomeComponent, canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: 'payment', component: OrderScreenComponent, canActivate: [AuthGuard, OrderModeGuard] },
  { path: '', pathMatch: 'full', component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
  providers: [AuthGuard, OrderModeGuard],
})
export class AppRoutingModule { }
