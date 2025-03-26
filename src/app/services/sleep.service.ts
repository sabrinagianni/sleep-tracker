import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
	providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData: boolean = true;
	public static AllSleepData: SleepData[] = [];
	public static AllOvernightData: OvernightSleepData[] = [];
	public static AllSleepinessData: StanfordSleepinessData[] = [];
	public static sleepinessDataUpdated = new BehaviorSubject<StanfordSleepinessData[]>([]);

	private sleepLogs: OvernightSleepData[] = [];
	private storage: Storage | null = null;
	public sleepLogsUpdated = new BehaviorSubject<OvernightSleepData[]>([]);
	public sleepinessLogsUpdated = new BehaviorSubject<StanfordSleepinessData[]>([]);

	constructor(private storageService: Storage) {
		if (SleepService.LoadDefaultData) {
			this.addDefaultData();
			SleepService.LoadDefaultData = false;
		}
		this.init();
	}

	async init() {
		const storage = await this.storageService.create();
		this.storage = storage;
		const storedSleepinessLogs = await this.storage.get('sleepinessLogs');
		if (storedSleepinessLogs) {
			SleepService.AllSleepinessData = storedSleepinessLogs.map(
				(log: any) => new StanfordSleepinessData(log.loggedValue, new Date(log.loggedAt))
			);
		}
		SleepService.sleepinessDataUpdated.next([...SleepService.AllSleepinessData]);

		// Load Overnight Sleep Logs
		const storedSleepLogs = await this.storage.get('sleepLogs');
		if (storedSleepLogs) {
			SleepService.AllOvernightData = storedSleepLogs.map(
				(log: any) => new OvernightSleepData(new Date(log.sleepStart), new Date(log.sleepEnd))
			);
		}
		this.sleepLogsUpdated.next([...SleepService.AllOvernightData]);
	}


	async getAllSleepLogs(): Promise<OvernightSleepData[]> {
		const logs: any[] = await this.storage?.get('sleepLogs') || [];

		return logs.map((log: any) => new OvernightSleepData(new Date(log.sleepStart), new Date(log.sleepEnd)));
	}

	async getLatestSleepLog(): Promise<OvernightSleepData | null> {
		const logs: any[] = await this.getAllSleepLogs();

		if (logs.length > 0) {
			// Convert plain objects to OvernightSleepData instances
			const convertedLogs = logs.map((log: any) => new OvernightSleepData(new Date(log.sleepStart), new Date(log.sleepEnd)));

			// Sort by sleep end time (latest first)
			convertedLogs.sort((a, b) => b.getSleepEnd().getTime() - a.getSleepEnd().getTime());

			return convertedLogs[0]; // Return most recent sleep log
		}
		return null;
	}


	async getAllSleepinessLogs(): Promise<StanfordSleepinessData[]> {
		return (await this.storage?.get('sleepinessLogs')) || [];
	}

	async addSleepinessLog(sleepLog: StanfordSleepinessData) {
		const logs = await this.getAllSleepinessLogs();
		logs.push(sleepLog);
		await this.storage?.set('sleepinessLogs', logs);
		this.sleepinessLogsUpdated.next(logs); // Notify subscribers
	}

	async deleteSleepinessLog(index: number) {
		const logs = await this.getAllSleepinessLogs();
		logs.splice(index, 1);
		await this.storage?.set('sleepinessLogs', logs);
		this.sleepinessLogsUpdated.next(logs);
	}

	async addSleepLog(sleepLog: OvernightSleepData) {
		const logs = await this.getAllSleepLogs();
		logs.push(sleepLog);
		await this.storage?.set('sleepLogs', logs);
		this.sleepLogsUpdated.next([...logs]);
	}


	async deleteSleepLog(index: number) {
		const logs = await this.getAllSleepLogs();
		logs.splice(index, 1);
		await this.storage?.set('sleepLogs', logs);
		this.sleepLogsUpdated.next(logs);
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData: OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
	}

	async logSleepinessData(sleepData: StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		await this.storage?.set('sleepinessLogs', SleepService.AllSleepinessData);
		SleepService.sleepinessDataUpdated.next([...SleepService.AllSleepinessData]);
	}

}
