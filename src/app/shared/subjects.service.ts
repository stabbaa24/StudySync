import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class SubjectsService {
    constructor(private http: HttpClient) { }

    url = "http://localhost:8010/api/subjects";

    getSubjects(): Observable<any> {
        return this.http.get<any>(this.url);
    }

    /*addSubject(data: any): Observable<any> {
        return this.http.post<any>(this.url, data);
    }*/

    addSubject(data: any): Observable<any> {
        return this.http.post<any>(this.url, data);
    }

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file, file.name);
        return this.http.post('http://localhost:8010/api/subjects/uploads', formData);
    }

}