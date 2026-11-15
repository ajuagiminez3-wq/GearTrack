import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiMessage, GearCategory, GearFilters, GearItem, GearItemInput } from '../models/gear.model';

@Injectable({ providedIn: 'root' })
export class GearService {
  // This service uses the real Milestone 3 Express / MySQL API.
  private readonly host = 'http://localhost:5051/api';
  constructor(private http: HttpClient) {}

  getCategories(): Observable<GearCategory[]> {
    return this.http.get<GearCategory[]>(`${this.host}/gear-categories`);
  }
  getItems(filters: GearFilters = {}): Observable<GearItem[]> {
    let params = new HttpParams();
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters.available !== undefined) params = params.set('available', String(filters.available));
    return this.http.get<GearItem[]>(`${this.host}/gear-items`, { params });
  }
  getItem(id: number): Observable<GearItem> {
    return this.http.get<GearItem>(`${this.host}/gear-items/${id}`);
  }
  createItem(item: GearItemInput): Observable<GearItem> {
    return this.http.post<GearItem>(`${this.host}/gear-items`, item);
  }
  updateItem(id: number, item: GearItemInput): Observable<GearItem> {
    return this.http.put<GearItem>(`${this.host}/gear-items/${id}`, item);
  }
  deleteItem(id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.host}/gear-items/${id}`);
  }
}
