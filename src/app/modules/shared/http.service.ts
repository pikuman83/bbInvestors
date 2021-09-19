// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable} from 'rxjs';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpService {

//   public title = '';
//   public user = '';

//   constructor(private http: HttpClient) {}

//   baseUrl = environment.apiUrl;
//   httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     }),
//   };
  
//   getMaxNo(path: string): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/${path}`, this.httpOptions);
//   }
//   add(object: any, path: string): Observable<any> {
//     return this.http.post<any>(`${this.baseUrl}/${path}`, object, this.httpOptions);
//   }
//   delete(id: any, path: string): Observable<any> {
//     return this.http.delete<any>(`${this.baseUrl}/${path}/${id}`, this.httpOptions);
//   }
//   edit(path: string, obj: any): Observable<number> {
//     return this.http.put<any>(`${this.baseUrl}/${path}`, obj, this.httpOptions);
//   }
//   login(user: any) {
//     return this.http.post(this.baseUrl + '/TokenRequest/Login', user);
//   }

// }