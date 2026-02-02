import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interno } from '../domain/interno.model';
import { InternoService } from '../../../core/services/internos.service';

@Injectable({
  providedIn: 'root'
})
export class InternosCreateVm {
  constructor(private internoService: InternoService) {}

  getById(id: string): Observable<Interno> {
    return this.internoService.getById(id);
  }

  create(interno: Interno): Observable<Interno> {
    return this.internoService.create(interno);
  }

  update(id: string, interno: Partial<Interno>): Observable<Interno> {
    return this.internoService.update(id, interno);
  }
}
