import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {

  private baseUrl = 'http://localhost:8083/api/sensor-data';

  constructor(private http: HttpClient) { }

  getComputedSensorValues(deviceId: number, startDate: string, endDate: string): Observable<any> {
    const url = `${this.baseUrl}/computed/${deviceId}?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get(url);
  }
}
