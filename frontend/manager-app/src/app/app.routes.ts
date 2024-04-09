import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PanelPageComponent } from './components/panel-page/panel-page.component';

export const routes: Routes = [
    { path: 'admin', component: PanelPageComponent },
    { path: '', component: HomePageComponent }
];
