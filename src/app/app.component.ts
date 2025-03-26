import { Component, NgModule } from '@angular/core';
import { IonApp, IonList, IonItem, IonBadge, IonLabel, IonContent, IonMenu, IonHeader, IonToolbar, IonTitle, IonButtons, IonRouterOutlet, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonIcon, IonTab } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { bed, home, pulse } from 'ionicons/icons';
import { Storage } from '@ionic/storage-angular';

import { HomePage } from './home/home.page';
import { LogOvernightSleepPage } from './log-overnight-sleep/log-overnight-sleep.page';
import { LogSleepinessPage } from './log-sleepiness/log-sleepiness.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonList, IonItem, IonBadge, IonLabel, IonContent, IonMenu, IonHeader, IonToolbar, IonTitle, IonButtons, IonRouterOutlet, IonMenuButton, IonTabs, IonTabBar, IonTabButton, IonIcon, IonTab],
})
export class AppComponent {

  private _storage: Storage | null = null;

  constructor(private router: Router, private storage: Storage) {
    addIcons({ bed, home, pulse });
    this.initStorage(); // Initialize storage
  }

  async initStorage() {
    this._storage = await this.storage.create();
  }

  home() {
    this.router.navigate(['/home']);
  }
  
  navigateToOvernightSleep() {
    this.router.navigate(['/log-overnight-sleep']);
  }

  navigateToSleepiness() {
    this.router.navigate(['/log-sleepiness']);
  }

  navigateToTab(tabName: string) {
    this.router.navigate([`/${tabName}`]); 
  }
}
