import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd,ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { InternoService } from '../services/internos.service';
import { Interno } from '../models/interno.model';

@Component({
  selector: 'app-internos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './internos-list.html',
  styleUrl: './internos-list.css'
})
export class InternosList implements OnInit, OnDestroy {
  private internoService = inject(InternoService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  internos: Interno[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    console.log('🔄 InternosList ngOnInit - Cargando datos...');
    this.loadInternos();
  }


  ngOnDestroy(): void {
    console.log('🔴 InternosList ngOnDestroy');
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInternos(): void {
    console.log('📡 Llamando a la API...');
    this.isLoading = true;
    this.errorMessage = null;

    this.internoService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ Datos recibidos:', data);
          console.log('📊 Cantidad de internos:', data.length);
          this.internos = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error al cargar internos:', err);
          console.error('Status:', err.status);
          console.error('Message:', err.message);
          this.errorMessage = 'Error al conectar con la API: ' + (err.status || 'Sin conexión');
          this.isLoading = false;
        },
        complete: () => { 
          console.log('🏁 Carga completada');
        }
      });
  }

  deleteInterno(id: string): void {
    if (!confirm('¿Está seguro de eliminar este interno?')) {
      return;
    }

    this.internoService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Interno eliminado con éxito');
          this.loadInternos();
        },
        error: (err) => {
          console.error('Error al eliminar el interno:', err);
          alert('Error al eliminar el interno');
        }
      });
  }
}