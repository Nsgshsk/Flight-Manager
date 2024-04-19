import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PanelPageComponent } from './components/panel-page/panel-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/panel-page/pages/dashboard/dashboard.component';
import { UsersComponent } from './components/panel-page/pages/users/users.component';
import { FlightsComponent } from './components/panel-page/pages/flights/flights.component';
import { PlanesComponent } from './components/panel-page/pages/planes/planes.component';
import { ReservationsComponent } from './components/panel-page/pages/reservations/reservations.component';
import { UserDetailsComponent } from './components/panel-page/pages/user-details/user-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    component: PanelPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/:id', component: UserDetailsComponent },
      { path: 'planes', component: PlanesComponent },
      { path: 'flights', component: FlightsComponent },
      { path: 'reservations', component: ReservationsComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '', component: HomePageComponent },
];
