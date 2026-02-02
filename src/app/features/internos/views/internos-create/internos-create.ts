import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Interno } from '../../domain/interno.model';
import { InternosCreateVm } from '../../viewmodels/internos-create.vm';

@Component({
  selector: 'app-interno-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './internos-create.html',
  styleUrl: './internos-create.css'
})
export class InternoCreateComponent implements OnInit, OnDestroy {
  private vm = inject(InternosCreateVm);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkIfEditMode();
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(1)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: [''],
      sexo: [''],
      fechaNacimiento: [''],
      identificacion: [''],
      idUbicacion: [null, Validators.required],
      idGeografia: [null],
      pabellon: [''],
      piso: [''],
      ala: [''],
      estado: ['ACTIVO', Validators.required],
      activo: [true],
      cambiarClave: [false],
      fechaIngreso: [''],
      prefijoPenal: [null],
      clave: [''],
      cortesia: [null],
      idPerfil: [null],
      tratamientoDatos: [null],
      desarrollo: [false],
      requeridoAgente: [false]
    });
  }

  private checkIfEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadInterno(id);
    }
  }

  private loadInterno(id: string): void {
    this.vm.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (interno) => {
          this.form.patchValue(interno);
        },
        error: (err) => {
          console.error('Error al cargar el interno:', err);
          this.errorMessage = 'Error al cargar el interno';
          alert(this.errorMessage);
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    // LIMPIEZA: Convertir valores antes de enviar
    const formValue = this.cleanFormData(this.form.value);

    const operation = this.isEditMode
      ? this.vm.update(formValue.id, formValue)
      : this.vm.create(formValue as Interno);

    operation
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert(this.isEditMode ? 'Interno actualizado con éxito' : 'Interno creado con éxito');
          this.router.navigate(['/internos'], {
            queryParams: { refresh: Date.now() }
          });
        },
        error: (err) => {
          console.error('Error al guardar el interno:', err);

          // Mostrar el error específico del backend
          if (err.error?.detail) {
            if (Array.isArray(err.error.detail)) {
              const errors = err.error.detail.map((e: any) =>
                `${e.loc?.join('.')}: ${e.msg}`
              ).join('\n');
              this.errorMessage = `Errores de validación:\n${errors}`;
            } else {
              this.errorMessage = err.error.detail;
            }
          } else {
            this.errorMessage = err.message || 'Error al guardar el interno';
          }

          alert(this.errorMessage);
          this.isSubmitting = false;
        }
      });
  }

  /**
   * Limpia los datos del formulario antes de enviar:
   * - Convierte strings vacíos a null
   * - Convierte números string a number
   * - Elimina campos undefined/null innecesarios
   */
  private cleanFormData(data: any): any {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Si es string vacío, convertir a null
      if (value === '' || value === undefined) {
        // No incluir el campo si es opcional
        if (['apellidos', 'identificacion', 'pabellon', 'piso', 'ala',
          'fechaNacimiento', 'fechaIngreso', 'clave', 'sexo'].includes(key)) {
          continue;
        }
        cleaned[key] = null;
        continue;
      }

      // Campos numéricos que pueden estar vacíos
      if (['idUbicacion', 'idGeografia', 'cortesia', 'prefijoPenal',
        'idPerfil', 'tratamientoDatos'].includes(key)) {
        if (value === null || value === '') {
          // idUbicacion es obligatorio
          if (key === 'idUbicacion') {
            cleaned[key] = null;
          }
          continue;
        }
        cleaned[key] = Number(value);
        continue;
      }

      // Campos de fecha: convertir a formato ISO o null
      if (['fechaNacimiento', 'fechaIngreso'].includes(key) && value) {
        cleaned[key] = value; // Ya viene en formato correcto del input type="date"
        continue;
      }

      // Otros campos: dejar como están
      cleaned[key] = value;
    }

    return cleaned;
  }

  goBack(): void {
    this.router.navigate(['/internos'], {
      queryParams: { refresh: Date.now() }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}