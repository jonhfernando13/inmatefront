import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { Interno } from '../models/interno.model';

@Injectable({
  providedIn: 'root'
})
export class InternoService {
  private http = inject(HttpClient);
  
  // URL de la API
  private readonly API_URL = 'http://127.0.0.1:8000/internos';

  // Obtener todos
  getAll(): Observable<Interno[]> {
    console.log('🔍 Servicio: Llamando GET', `${this.API_URL}/`);
    return this.http.get<Interno[]>(`${this.API_URL}/`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener uno solo
  getById(id: string): Observable<Interno> {
    return this.http.get<Interno>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear nuevo
  create(interno: Interno): Observable<Interno> {
    return this.http.post<Interno>(`${this.API_URL}/`, interno).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar
  update(id: string, interno: Partial<Interno>): Observable<Interno> {
    return this.http.put<Interno>(`${this.API_URL}/${id}`, interno).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar
  delete(id: string): Observable<Interno[]> {
    return this.http.delete<Interno[]>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('🚨 Error HTTP:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté corriendo en http://127.0.0.1:8000';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}