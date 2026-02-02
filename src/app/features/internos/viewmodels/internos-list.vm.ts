import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interno } from '../domain/interno.model';
import { InternoService } from '../../../core/services/internos.service';

@Injectable({
  providedIn: 'root'
})
export class InternosListVm {
  constructor(private internoService: InternoService) {}

  loadAll(): Observable<Interno[]> {
    return this.internoService.getAll();
  }

  deleteById(id: string): Observable<Interno[]> {
    return this.internoService.delete(id);
  }
}
