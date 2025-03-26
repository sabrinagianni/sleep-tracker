import { Component, OnInit } from '@angular/core';
import { IonRange, IonLabel, IonList, IonItem, IonListHeader, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonIcon } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { CommonModule } from '@angular/common';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-ticks',
  templateUrl: './ticks.component.html',
  styleUrls: ['./ticks.component.scss'],
  imports: [IonRange, IonLabel, IonList, IonItem, IonListHeader, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, CommonModule, IonIcon],
})
export class TicksComponent implements OnInit {
  mostRecentSleepiness: StanfordSleepinessData | null = null;
  sleepinessLevel: number | null = null;
  sleepinessText: string = '';
  sleepinessLogs: StanfordSleepinessData[] = [];

  constructor(public sleepService: SleepService) {
    this.loadSleepinessLogs();
    addIcons({ closeCircle });
  }

  updateSleepinessLevel(event: any) {
    const value = event.detail.value;
    if (value >= 1 && value <= 7) { // Ensure valid index
      this.sleepinessLevel = value;
      this.sleepinessText = String(StanfordSleepinessData.ScaleValues[value] ?? ''); // Get the description
    }
  }

  logSleepiness() {
    if (this.sleepinessLevel !== null) {
      const newLog = new StanfordSleepinessData(this.sleepinessLevel, new Date());
      this.sleepService.logSleepinessData(newLog);
      this.loadSleepinessLogs();
    }
  }

  loadSleepinessLogs() {
    this.sleepinessLogs = SleepService.AllSleepinessData;
  }

  deleteLog(index: number) {
    if (index >= 0 && index < SleepService.AllSleepinessData.length) {
      SleepService.AllSleepinessData.splice(index, 1);
      this.updateMostRecentSleepiness();
    }
  }

  updateMostRecentSleepiness() {
    if (SleepService.AllSleepinessData.length > 0) {
      this.mostRecentSleepiness = SleepService.AllSleepinessData[SleepService.AllSleepinessData.length - 1];
    } else {
      this.mostRecentSleepiness = null;
    }
  }

  ngOnInit() { }

}
