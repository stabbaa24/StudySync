import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class TeachersService {
    constructor(private loggingService: LoggingService,
        private http: HttpClient) { }

    url = "http://localhost:8010/api/teachers";

    getTeachers(): Observable<any> {
        return this.http.get<any>(this.url);
    }

    addTeacher(data: any): Observable<any> {
        return this.http.post<any>(this.url, data);
    }
}