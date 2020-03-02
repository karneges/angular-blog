import { Component, Input, OnInit } from '@angular/core';
import { AlertServices } from '../../services/alert.services';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() delay = 5000;
  type: string;
  text: string;

  constructor(public alertServices: AlertServices) {}

  ngOnInit(): void {
    this.alertServices.alert$.subscribe(alert => {
      this.text = alert.text;
      this.type = alert.type;

      const timeout = setTimeout(() => {
        clearInterval(timeout);
        this.text = '';
      }, this.delay);
    });
  }
}
