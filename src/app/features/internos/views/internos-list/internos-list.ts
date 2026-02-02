import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { takeUntil, filter, finalize, switchMap, catchError, startWith, tap } from 'rxjs/operators';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Interno } from '../../domain/interno.model';
import { InternosListVm } from '../../viewmodels/internos-list.vm';

@Component({
  selector: 'app-internos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './internos-list.html',
  styleUrl: './internos-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternosList implements OnInit, OnDestroy {
  private vm = inject(InternosListVm);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private reload$ = new BehaviorSubject<void>(undefined);

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  internos$ = this.reload$.pipe(
    startWith(void 0),
    tap(() => {
      this.loading$.next(true);
      this.error$.next(null);
    }),
    switchMap(() =>
      this.vm.loadAll().pipe(
        catchError((err) => {
          console.error('Error al cargar internos:', err);
          this.error$.next('Error al cargar internos');
          return of([] as Interno[]);
        }),
        finalize(() => {
          this.loading$.next(false);
        })
      )
    )
  );


  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.reload$?.next();
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.reload$?.next();
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteInterno(id: string): void {
    if (!confirm('¿Está seguro de eliminar este interno?')) {
      return;
    }

    this.vm.deleteById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Interno eliminado con éxito');
          this.reload$?.next();
        },
        error: (err) => {
          console.error('Error al eliminar el interno:', err);
          alert('Error al eliminar el interno');
        }
      });
  }
}