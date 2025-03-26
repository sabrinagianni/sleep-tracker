import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'log-overnight-sleep',
    loadComponent: () => import('./log-overnight-sleep/log-overnight-sleep.page').then(m => m.LogOvernightSleepPage)
  },
  {
    path: 'log-sleepiness',
    loadComponent: () => import('./log-sleepiness/log-sleepiness.page').then(m => m.LogSleepinessPage)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
