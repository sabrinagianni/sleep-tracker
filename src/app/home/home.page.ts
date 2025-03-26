import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonCardContent } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { addIcons } from 'ionicons';
import { moon } from 'ionicons/icons';

import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogOvernightSleepPage } from '../log-overnight-sleep/log-overnight-sleep.page';
import { ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	imports: [LogOvernightSleepPage, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonCardContent],
})
export class HomePage {
	todaysDate: string = '';
	// latestSleepLog: OvernightSleepData /*| StanfordSleepinessData*/| null = null;
	mostRecentSleepiness: StanfordSleepinessData | null = null;
	latestSleepLog: OvernightSleepData | null = null;

	constructor(public sleepService: SleepService, private cdr: ChangeDetectorRef) {
		addIcons({ moon });
	}

	async ngOnInit() {
		this.todaysDate = new Date().toLocaleDateString();
		await this.loadMostRecentSleepiness();
		this.loadLatestSleepLog();

		this.sleepService.sleepLogsUpdated.subscribe((updatedLogs) => {
			this.latestSleepLog = updatedLogs.length > 0 ? updatedLogs[updatedLogs.length - 1] : null;
			this.cdr.detectChanges();
		});

		this.sleepService.sleepinessLogsUpdated.subscribe(() => {
			this.loadMostRecentSleepiness();
		});
	}

	async loadMostRecentSleepiness() {
		const allSleepinessData = await this.sleepService.getAllSleepinessLogs();
		this.mostRecentSleepiness = allSleepinessData.length > 0 ? allSleepinessData[allSleepinessData.length - 1] : null;
	}


	async loadLatestSleepLog() {
		this.latestSleepLog = await this.sleepService.getLatestSleepLog();
		this.cdr.detectChanges(); // Force UI update
	}

	get mostRecent() {
		const allSleepinessData = SleepService.AllSleepinessData;
		return allSleepinessData.length > 0 ? allSleepinessData[allSleepinessData.length - 1] : null;
	}

	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
