import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SensorDataService } from './monitoring.service';
import { formatDate } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { WebSocketService } from '../notification/websockets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sensor-data',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class SensorDataComponent implements OnInit {

  computedData: any[] = [];
  @Input() deviceId: number = 0;
  startDate: Date = new Date('2023-12-11');
  endDate: Date = new Date('2023-12-11');
  chart: Chart | undefined;
  notifications: string[] = [];


  constructor(private snackBar: MatSnackBar, private sensorDataService: SensorDataService, private webSocketService: WebSocketService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchData();
    this.webSocketService.initializeWebSocketConnection();
    this.webSocketService.notifications.subscribe((message: string | null) => {
      if (message) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
      }
    });
  }
  

  ngAfterViewInit(): void {
    if (this.computedData.length > 0) {
      this.createChart();
    }
  }

  fetchData(): void {
    let formattedStartDate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US');
    let formattedEndDate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US');

    this.sensorDataService.getComputedSensorValues(this.deviceId, formattedStartDate, formattedEndDate)
      .subscribe(data => {
        this.computedData = data;
        // console.log(this.computedData); // Check the data
        this.createChart();
      }, error => console.error(error));

  }

  createChart(): void {

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');

      if (this.chart) {
        this.chart.destroy();
      }


      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.computedData.map(d => new Date(d.timestamp).toLocaleDateString()), // convert timestamp to readable date
            datasets: [{
              label: 'Sensor Value',
              data: this.computedData.map(d => d.computedValue),

              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },

          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
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

}
