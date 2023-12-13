import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/users.service';
import { Device, DeviceService } from '../device/device.service';
import { AuthService } from '../auth.service';
import { SensorDataService } from '../monitoring/monitoring.service';
import { formatDate } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { WebSocketService } from '../notification/websockets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userDevice',
  templateUrl: './userDevice.component.html',
  styleUrls: ['./userDevice.component.css']
})
export class UserDeviceComponent implements OnInit {
  userDevices: Device[] = [];
  selectedDeviceId: number | null = null;
  computedData: any[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  chart: Chart | undefined;
  notifications: string[] = [];
  currentUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private deviceService: DeviceService,
    private sensorDataService: SensorDataService,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.deviceService.getUserDevices(userId).subscribe(
        data => {
          this.userDevices = data;
          this.webSocketService.initializeWebSocketConnection();
          this.subscribeToWebSocket();
        },
        error => {
          console.error('Error in fetching devices: ', error);
        }
      );
    } else {
      console.error('User ID is null. Cannot fetch devices.');
    }
  
  }
    


onShowChart(deviceId: number): void {
  this.selectedDeviceId = deviceId;
  this.fetchData();
}

fetchData(): void {
  if(this.selectedDeviceId === null) return;

  let formattedStartDate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US');
  let formattedEndDate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US');

  this.sensorDataService.getComputedSensorValues(this.selectedDeviceId, formattedStartDate, formattedEndDate)
    .subscribe(data => {
      this.computedData = data;
      this.createChart();
    }, error => console.error(error));
}

createChart(): void {
  const canvas = document.getElementById('myChart') as HTMLCanvasElement;
  if(canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  if (this.chart) {
    this.chart.destroy();
  }

  if (ctx) {
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.computedData.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [{
          label: 'Sensor Value',
          data: this.computedData.map(d => d.computedValue),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  } else {
    console.error('Unable to get canvas context');
  }
} else {
  console.error('Canvas element not found');
}
  }

ngOnDestroy() {
  this.webSocketService.disconnect();
}

subscribeToWebSocket() {
  this.webSocketService.notifications.subscribe((message: string | null) => {
    if (message) {
      const messageData = JSON.parse(message);
      if (messageData.userId === this.currentUserId && messageData.deviceId === this.selectedDeviceId) {
        this.notifications.push(messageData.content);
        this.snackBar.open(messageData.content, 'Close', { duration: 3000 });
      }
    }
  });
}
}
