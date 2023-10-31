import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/users.service';
import { Device, DeviceService } from '../device/device.service';  
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-userDevice',
  templateUrl: './userDevice.component.html',
  styleUrls: ['./userDevice.component.css']
})
export class UserDeviceComponent implements OnInit {
  userDevices: Device[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private deviceService: DeviceService
  ) {}
  
  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
        this.deviceService.getUserDevices(userId).subscribe(
            data => {
                this.userDevices = data;
            },
            error => {
                console.error('Error in fetching devices: ', error);
            }
        );
    } else {
        console.error('User ID is null. Cannot fetch devices.');
    }
}

}
