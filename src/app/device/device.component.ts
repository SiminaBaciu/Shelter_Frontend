import { Component, OnInit } from '@angular/core';
import { Device, DeviceService } from './device.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
    devices: Device[] = [];
    selectedDevice: Device | null = null;
    addDeviceForm: FormGroup;
    updateDeviceForm: FormGroup;

    constructor(private deviceService: DeviceService, private authService: AuthService) {
        this.addDeviceForm = new FormGroup({
            address: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            maxHourlyConsumption: new FormControl('', Validators.required),
            userId: new FormControl('')
        });
        this.updateDeviceForm = new FormGroup({
            address: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            maxHourlyConsumption: new FormControl('', Validators.required),
            userId: new FormControl('')
        });
    }

    ngOnInit() {
        this.deviceService.getAllDevices().subscribe(
            data => {
                this.devices = data;
            },
            error => {
                console.error('Error in fetching devices: ', error);

            }
        );

    }


    addDevice(): void {

        if (this.addDeviceForm.valid) {
            const device: Device = this.addDeviceForm.value;

            this.deviceService.createDevice(device).subscribe(
                data => {
                    this.devices.push(data);
                },
                error => {
                    console.error('Error in creating device: ', error);
                }
            );
        }

    }


    deleteDevice(device: Device): void {
        this.deviceService.deleteDevice(device).subscribe(
            data => {
                this.devices = this.devices.filter(u => u.id !== device.id);
            },
            error => {
                console.error('Error deleting devices: ', error);
            }
        );
    }


    selectForUpdate(device: Device): void {
        this.selectedDevice = { ...device };
        this.updateDeviceForm.get('address')?.setValue(device.address);
        this.updateDeviceForm.get('description')?.setValue(device.description);
        this.updateDeviceForm.get('userId')?.setValue(device.userId);
    }

    updateDevice(): void {

        if (this.updateDeviceForm.valid && this.selectedDevice) {
            const deviceToUpdate: Device = this.updateDeviceForm.value;
            deviceToUpdate.id = this.selectedDevice.id;
            this.deviceService.updateDevice(deviceToUpdate).subscribe(
                updatedDevice => {
                    const index = this.devices.findIndex(u => u.id === updatedDevice.id);
                    if (index !== -1) {
                        this.devices[index] = updatedDevice;
                    }
                    this.selectedDevice = null;
                },
                error => {
                    console.error('Error updating user: ', error);
                }
            );
        }
    }

}

