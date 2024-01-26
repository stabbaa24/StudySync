import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class StudentsService {
    constructor(private loggingService: LoggingService,
        private http: HttpClient) { }

    url = "http://localhost:8010/api/students";

    getStudents(): Observable<any> {
        return this.http.get<any>(this.url);
    }

    addStudent(data: any): Observable<any> {
        return this.http.post<any>(this.url, data);
    } 

    //https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file, file.name);
        return this.http.post(this.url + '/uploads', formData);
    }    
}