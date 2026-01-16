import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface AnimalDTO {
  id: number;
  name: string;
  age: number;
  color: string;
  size: string;
  status: string;
  breedName: string;
  arrivalDate: string;
  primaryCode: string;
  secondaryCode?: string;
  monthsInShelter?: number;
}

@Injectable({ providedIn: 'root' })
export class AnimalService {
  constructor(private http: HttpClient) {}

  getAllAnimalsUser(): Observable<AnimalDTO[]> {
    return this.http.post<AnimalDTO[]>(
      `${environment.animalBaseUrl}/animal-secured/getAllAnimalsUser`,
      {}
    );
  }

  getAllAnimalsAdmin(): Observable<AnimalDTO[]> {
    return this.http.post<AnimalDTO[]>(
      `${environment.animalBaseUrl}/animal-secured/getAllAnimals`,
      {}
    );
  }

  createAnimal(dto: AnimalDTO): Observable<AnimalDTO> {
    return this.http.post<AnimalDTO>(
      `${environment.animalBaseUrl}/animal-secured`,
      dto
    );
  }

  updateAnimal(dto: AnimalDTO): Observable<AnimalDTO> {
    return this.http.post<AnimalDTO>(
      `${environment.animalBaseUrl}/animal-secured/update`,
      dto
    );
  }

  deleteAnimal(id: number): Observable<AnimalDTO[]> {
    return this.http.post<AnimalDTO[]>(
      `${environment.animalBaseUrl}/animal-secured/delete`,
      { id }
    );
  }
}
