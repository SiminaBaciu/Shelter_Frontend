import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Device {
    id: number;
    address: string;
    description: string;
    maxHourlyConsumption : number;
    userId?: number;
}

@Injectable({
    providedIn: 'root'
})

export class DeviceService {
    constructor(private postService: HttpClient) { }

    getAllDevices(): Observable<any> {
        const postBody = {};
        const postUrl = 'http://localhost:8082/device/getAllDevices';

        return this.postService.post(postUrl, postBody);
    }

    createDevice(device: Device): Observable<any> {
        const postUrl = 'http://localhost:8082/device/insertDevice';
        return this.postService.post(postUrl, device);
    }

    deleteDevice(device: Device): Observable<any> {
        const postUrl = 'http://localhost:8082/device/deleteDevice';
        return this.postService.post(postUrl, device);
    }
    
    updateDevice(device: Device): Observable<any> {
        const postUrl = 'http://localhost:8082/device/updateDevice';
        return this.postService.post(postUrl, device);
    }

    getUserDevices(userId: number): Observable<Device[]> {
        const postUrl = 'http://localhost:8082/device/getUserDevices';
        return this.postService.post<Device[]>(postUrl, { userId: userId });
    }
    
}