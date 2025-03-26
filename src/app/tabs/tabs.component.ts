import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonIcon, IonTab, IonTabBar, IonTabButton, IonTabs],
})
export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
