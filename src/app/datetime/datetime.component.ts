import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IonDatetime, IonDatetimeButton, IonModal, IonCardContent, IonCard, IonCardTitle, IonCardHeader} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  standalone: true,
  imports: [IonDatetime, IonDatetimeButton, IonModal, IonCardContent, IonCard, IonCardTitle, IonCardHeader, FormsModule],
})
export class DatetimeComponent  implements OnInit {

  @Output() sleepTimeSelected = new EventEmitter<string>();
  @Output() wakeTimeSelected = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {}

  sleepTime: string = '';
  wakeTime: string = '';  

  // Method to handle when a sleep time is selected
  onSleepTimeChange(event: any) {
    this.sleepTime = event.detail.value;
    this.sleepTimeSelected.emit(this.sleepTime);  // Emit the value to the parent
  }

  // Method to handle when a wake time is selected
  onWakeTimeChange(event: any) {
    this.wakeTime = event.detail.value;
    this.wakeTimeSelected.emit(this.wakeTime);  // Emit the value to the parent
  }
}
