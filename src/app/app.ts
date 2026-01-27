import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Interno } from './models/interno.model';
import { InternoService } from './services/internos.service';

@Component({
  selector: 'app-internos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  private internoService = inject(InternoService);
  private destroy$ = new Subject<void>();

  internos: Interno[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadInternos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInternos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // CORREGIDO: Usa el servicio, no HttpClient directamente
    this.internoService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.internos = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar internos:', err);
          this.errorMessage = 'Error al cargar los internos';
          this.isLoading = false;
        }
      });
  }

  deleteInterno(id: string): void {
    if (!confirm('¿Está seguro de eliminar este interno?')) {
      return;
    }

    // CORREGIDO: Usa el servicio
    this.internoService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.internos = this.internos.filter(i => i.id !== id);
          alert('Interno eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar interno:', err);
          this.errorMessage = 'Error al eliminar el interno';
        }
      });
  }
}