import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

import { File } from './file';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class FileService {
  private restUrl = 'http://localhost:3000/api/files';  // URL para os arquivos da api

  constructor(
    private http: HttpClient) { }


  /* GET dos arquivos no servidor*/
  getFiles (): Observable<File[]> {
    const url = `${this.restUrl}`;
    return this.http.get<File[]>(this.restUrl)
      .pipe(
        catchError(this.handleError('getFiles', []))
      );
  }

  /* POST: adicionar arquivo no servidor */
  addFile (file: File): Observable<File> {
    return this.http.post<File>(this.restUrl, file, httpOptions).pipe(
      catchError(this.handleError<File>('addFile'))
    );
  }

  /* DELETE: Deletar arquivo do servidor */
  deleteFile (file: File | number): Observable<File> {
    const fileSeq = typeof file === 'number' ? file : file.fileSeq;
    const url = `${this.restUrl}/${fileSeq}`;

    return this.http.delete<File>(url, httpOptions).pipe(
      catchError(this.handleError<File>('deleteFile'))
    );
  }

  //  @param operation - name of the operation that failed
  //  @param result - optional value to return as the observable result
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
