import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdoptionDTO, AdoptionService } from './adoption.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-adoptions',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {

  adoptions: AdoptionDTO[] = [];
  error: string | null = null;

  isAdmin = false;
  userId: number | null = null;

  addForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adoptionService: AdoptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ROLE_ADMIN';
    this.userId = this.authService.getUserId();

    this.addForm = this.fb.group({
      animalId: [null, Validators.required],
      isFoster: [false],
      adoptionDate: ['', Validators.required]
    });

    this.load();
  }

  load() {
    this.error = null;

    const obs = this.isAdmin
      ? this.adoptionService.getAllAdoptions()
      : this.adoptionService.getUserAdoptions(this.userId!);

    obs.subscribe({
      next: (res) => (this.adoptions = res),
      error: (e) => (this.error = e?.error?.message || e?.error || 'Failed to load adoptions')
    });
  }

  add() {
    if (this.addForm.invalid) return;
    if (!this.userId) {
      this.error = 'No userId in session';
      return;
    }

    const dto: AdoptionDTO = {
      userId: this.userId,
      animalId: this.addForm.value.animalId,
      isFoster: this.addForm.value.isFoster,
      adoptionDate: this.addForm.value.adoptionDate
    };

    this.adoptionService.createAdoption(dto).subscribe({
      next: () => {
        this.addForm.reset({ isFoster: false });
        this.load();
      },
      error: (e) => (this.error = e?.error?.message || e?.error || 'Failed to create adoption')
    });
  }

  delete(a: AdoptionDTO) {
    if (!this.isAdmin) return;
    if (!a.id) return;

    this.adoptionService.deleteAdoption(a.id).subscribe({
      next: () => this.load(),
      error: (e) => (this.error = e?.error?.message || e?.error || 'Failed to delete adoption')
    });
  }
}
