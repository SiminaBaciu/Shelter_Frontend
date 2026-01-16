import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface AdoptionDTO {
  id?: number;
  isFoster?: boolean;
  adoptionDate?: string; // yyyy-MM-dd
  userId?: number;
  animalId?: number;
}

@Injectable({ providedIn: 'root' })
export class AdoptionService {
  constructor(private http: HttpClient) {}

  // USER: get own adoptions
  getUserAdoptions(userId: number): Observable<AdoptionDTO[]> {
    return this.http.post<AdoptionDTO[]>(
      `${environment.animalBaseUrl}/adoption-secured/getUserAdoptions`,
      { userId }
    );
  }

  // ADMIN: get all adoptions
  getAllAdoptions(): Observable<AdoptionDTO[]> {
    return this.http.post<AdoptionDTO[]>(
      `${environment.animalBaseUrl}/adoption-secured/getAllAdoptions`,
      {}
    );
  }

  // USER creates an adoption
  createAdoption(dto: AdoptionDTO): Observable<AdoptionDTO> {
    return this.http.post<AdoptionDTO>(
      `${environment.animalBaseUrl}/adoption-secured/create`,
      dto
    );
  }

  // ADMIN deletes an adoption
  deleteAdoption(id: number): Observable<void> {
    return this.http.post<void>(
      `${environment.animalBaseUrl}/adoption-secured/delete`,
      { id }
    );
  }
}
