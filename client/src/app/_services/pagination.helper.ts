import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return params;
}

export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient,
  baseUrl = environment.apiUrl
) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http
    .get<T>(`${baseUrl}/${url}`, {
      observe: 'response',
      params,
    })
    .pipe(
      map((response) => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return paginatedResult;
      })
    );
}