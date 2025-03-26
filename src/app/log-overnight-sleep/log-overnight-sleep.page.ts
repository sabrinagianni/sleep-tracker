import { Component, /*CUSTOM_ELEMENTS_SCHEMA,*/ OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatetimeComponent } from '../datetime/datetime.component';
import { ToastController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { NavController } from '@ionic/angular';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,  IonButton, IonDatetime, IonDatetimeButton, IonModal, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-log-overnight-sleep',
  templateUrl: './log-overnight-sleep.page.html',
  styleUrls: ['./log-overnight-sleep.page.scss'],
  standalone: true,
  imports: [CommonModule, DatetimeComponent, IonContent, IonHeader, IonTitle, IonToolbar, IonItem,  IonItem, IonButton, IonDatetime, IonDatetimeButton, IonModal, IonText]
})

export class LogOvernightSleepPage implements OnInit {
  sleepTime: string = '';
  wakeTime: string = '';
  totalSleepTime: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  goToBed: Date = new Date();
  wakeUp: Date = new Date();

  sleepLogs: OvernightSleepData[] = [];

  constructor(private sleepService: SleepService, private toastController: ToastController, private navCtrl: NavController) { }

  ngOnInit() {}

  // Capture the sleep time from the child component
  onSleepTimeSelected(sleepTime: string) {
    this.sleepTime = sleepTime;
    this.calculateTotalSleepTime();  // Update total sleep time when the sleep time is selected
  }

  // Capture the wake time from the child component
  onWakeTimeSelected(wakeTime: string) {
    this.wakeTime = wakeTime;
    this.calculateTotalSleepTime();  // Update total sleep time when the wake time is selected
  }

  async saveSleepLog() {

    // Check if both sleep and wake times are provided
    if (!this.sleepTime || !this.wakeTime) {
      this.errorMessage = 'Please select both sleep and wake times!';
      this.successMessage = '';
      return;
    }

    const sleepDate = new Date(this.sleepTime);
    const wakeDate = new Date(this.wakeTime);

    if (wakeDate < sleepDate) {
      this.errorMessage = "Oops! Your sleep time needs to come before your wake-up time. Unless you're dreaming in reverse?";
      this.successMessage = '';
      return;
    }

    // Create a new sleep log entry
    const newSleepLog = new OvernightSleepData(sleepDate, wakeDate);
    // Add it to the service
    this.sleepService.addSleepLog(newSleepLog);

    // Calculate total sleep time
    this.calculateTotalSleepTime();

    // Success message
    this.successMessage = `Sleep log saved: ${newSleepLog.summaryString()}`;
    this.errorMessage = '';

    this.presentToast('Sleep log saved successfully!', 'success');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  calculateTotalSleepTime() {
    if (this.sleepTime && this.wakeTime) {
      const sleep = new Date(this.sleepTime);
      const wake = new Date(this.wakeTime);
      const differenceInMinutes = (wake.getTime() - sleep.getTime()) / (1000 * 60) //ms -> mins
      
      if (differenceInMinutes < 0) {
        this.errorMessage = "Oops! Your sleep time needs to come before your wake-up time. Unless you're dreaming in reverse?";
        this.totalSleepTime = '';
      } else {
        this.errorMessage = '';
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = Math.floor(differenceInMinutes % 60);
        this.totalSleepTime = `${hours} hrs ${minutes} mins`;
      }
    }
  }
}
