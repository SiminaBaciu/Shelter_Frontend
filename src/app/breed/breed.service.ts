import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Breed {
  id: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class BreedService {
  constructor(private http: HttpClient) {}

  getAllBreedsUser(): Observable<Breed[]> {
    return this.http.post<Breed[]>(`${environment.animalBaseUrl}/breed/getAllBreedsUser`, {});
  }
}
