import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BillServiceItem } from '../models/bill-service.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://womenapi.onrender.com/api/BillServices';

  // Signal state management for local reactive updates
  public services = signal<BillServiceItem[]>([]);
  public loading = signal<boolean>(false);

   
  getAll(): Observable<BillServiceItem[]> {
    this.loading.set(true);
    return this.http.get<BillServiceItem[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.services.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

 
  getById(id: number): Observable<BillServiceItem> {
    return this.http.get<BillServiceItem>(`${this.apiUrl}/${id}`);
  }

 
  create(item: BillServiceItem): Observable<BillServiceItem> {
    return this.http.post<BillServiceItem>(this.apiUrl, item).pipe(
      tap((newItem) => {
        this.services.update((current) => [...current, newItem]);
      })
    );
  }

 
  update(id: number, item: BillServiceItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item).pipe(
      tap(() => {
        this.services.update((current) =>
          current.map((s) => (s.id === id ? { ...s, ...item } : s))
        );
      })
    );
  }

 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.services.update((current) => current.filter((s) => s.id !== id));
      })
    );
  }
}