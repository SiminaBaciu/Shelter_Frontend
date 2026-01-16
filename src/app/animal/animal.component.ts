import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AnimalService, AnimalDTO } from './animal.service';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification/notification.service';
import { AdoptionService } from '../adoption/adoption.service';

@Component({
  selector: 'app-animals',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})
export class AnimalsComponent implements OnInit, OnDestroy {
  animals: AnimalDTO[] = [];
  error: string | null = null;

  isAdmin = false;
  isUser = false;
  userId: number | null = null;

  addAnimalForm!: FormGroup;
  updateAnimalForm!: FormGroup;
  selectedAnimal: AnimalDTO | null = null;

  notifications: string[] = [];
  private notifSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ROLE_ADMIN';
    this.isUser = role === 'ROLE_USER';
    this.userId = this.authService.getUserId();

    this.addAnimalForm = this.fb.group({
      name: ['', Validators.required],
      breedName: ['', Validators.required],
      age: [0, Validators.required],
      arrivalDate: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      status: ['', Validators.required],
      primaryCode: ['', Validators.required],
      secondaryCode: ['']
    });

    this.updateAnimalForm = this.fb.group({
      name: ['', Validators.required],
      breedName: ['', Validators.required],
      age: [0, Validators.required],
      arrivalDate: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      status: ['', Validators.required],
      primaryCode: ['', Validators.required],
      secondaryCode: ['']
    });

    this.loadAnimals();

    this.notifSub = this.notificationService.stream().subscribe({
      next: (msg: string) => {
        this.notifications.unshift(msg);
        this.loadAnimals();
      },
      error: () => {
        // ignore; nginx/sse reconnects can error sometimes
      }
    });
  }

  ngOnDestroy(): void {
    this.notifSub?.unsubscribe();
  }

  loadAnimals(): void {
    this.error = null;

    const obs = this.isAdmin
      ? this.animalService.getAllAnimalsAdmin()
      : this.animalService.getAllAnimalsUser();

    obs.subscribe({
      next: (res: AnimalDTO[]) => (this.animals = res),
      error: (e: any) =>
        (this.error = e?.error?.message || e?.error || 'Failed to load animals')
    });
  }

  addAnimal(): void {
    if (!this.isAdmin) return;
    if (this.addAnimalForm.invalid) return;

    const dto: AnimalDTO = {
      id: 0,
      ...this.addAnimalForm.value
    };

    this.animalService.createAnimal(dto).subscribe({
      next: () => {
        this.addAnimalForm.reset();
        this.loadAnimals();
      },
      error: (e: any) =>
        (this.error = e?.error?.message || e?.error || 'Failed to add animal')
    });
  }

  deleteAnimal(id: number): void {
    if (!this.isAdmin) return;

    this.animalService.deleteAnimal(id).subscribe({
      next: () => this.loadAnimals(),
      error: (e: any) =>
        (this.error = e?.error?.message || e?.error || 'Failed to delete animal')
    });
  }

  selectForUpdate(a: AnimalDTO): void {
    if (!this.isAdmin) return;

    this.selectedAnimal = a;

    this.updateAnimalForm.patchValue({
      name: a.name,
      breedName: a.breedName,
      age: a.age,
      arrivalDate: (a.arrivalDate || '').toString().slice(0, 10),
      color: a.color,
      size: a.size,
      status: a.status,
      primaryCode: a.primaryCode,
      secondaryCode: a.secondaryCode || ''
    });
  }

  updateAnimal(): void {
    if (!this.isAdmin) return;
    if (!this.selectedAnimal) return;
    if (this.updateAnimalForm.invalid) return;

    const dto: AnimalDTO = {
      id: this.selectedAnimal.id,
      ...this.updateAnimalForm.value
    };

    this.animalService.updateAnimal(dto).subscribe({
      next: () => {
        this.cancelUpdate();
        this.loadAnimals();
      },
      error: (e: any) =>
        (this.error = e?.error?.message || e?.error || 'Failed to update animal')
    });
  }

  cancelUpdate(): void {
    this.selectedAnimal = null;
    this.updateAnimalForm.reset();
  }

  adoptAnimal(animalId: number): void {
    if (!this.isUser) return;

    if (!this.userId) {
      this.error = 'No userId found (login again).';
      return;
    }

    const dto = {
      userId: this.userId,
      animalId,
      isFoster: false,
      adoptionDate: new Date().toISOString().slice(0, 10)
    };

    this.adoptionService.createAdoption(dto).subscribe({
      next: () => {
        this.notifications.unshift(`Adoption created for animal id=${animalId}`);
        this.loadAnimals();
      },
      error: (e: any) =>
        (this.error = e?.error?.message || e?.error || 'Failed to adopt animal')
    });
  }

  clearNotifications(): void {
    this.notifications = [];
  }
}
