import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PanelPageComponent } from './components/panel-page/panel-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: PanelPageComponent, children: [] },
  { path: '', component: HomePageComponent },
];
