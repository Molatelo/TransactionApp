import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Transaction } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  apiUrl = "http://localhost:4000/";

  //Get all
  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl + "api/transactions", httpOptions);
  }

  //Get By Id
  getById(id: number): Observable<Transaction>{
    return this.http.get<Transaction>(this.apiUrl + `api/transactions/${id}`, httpOptions);
  }

  //Create
  create(item: Transaction): Observable<Transaction>{
    return this.http.post<Transaction>(this.apiUrl + "api/transactions", item, httpOptions);
  }

  //Update
  update(id: number, item: Transaction): Observable<Transaction>{
    return this.http.put<Transaction>(this.apiUrl + `api/transactions/${id}`, item, httpOptions);
  }

  //Delete
  delete(id: number): Observable<{}>{
    return this.http.delete(this.apiUrl + `api/transactions/${id}`, httpOptions);
  }
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
