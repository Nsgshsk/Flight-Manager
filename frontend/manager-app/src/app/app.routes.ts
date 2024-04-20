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
import { PlaneDetailsComponent } from './components/panel-page/pages/plane-details/plane-details.component';
import { FlightDetailsComponent } from './components/panel-page/pages/flight-details/flight-details.component';
import { ReservationDetailsComponent } from './components/panel-page/pages/reservation-details/reservation-details.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { ReservationPageComponent } from './components/reservation-page/reservation-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    component: PanelPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent, canActivate: [isAdminGuard] },
      {
        path: 'users/:id',
        component: UserDetailsComponent,
        canActivate: [isAdminGuard],
      },
      { path: 'planes', component: PlanesComponent },
      { path: 'planes/:id', component: PlaneDetailsComponent },
      { path: 'flights', component: FlightsComponent },
      { path: 'flights/:id', component: FlightDetailsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservations/:id', component: ReservationDetailsComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '', component: HomePageComponent },
  { path: ':id', component: ReservationPageComponent },
];
