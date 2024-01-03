import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../subjects/subject.model';

@Injectable({
    providedIn: 'root'
})

export class SubjectsService {
    constructor(private http: HttpClient) { }

    url = "http://localhost:8010/api/subjects";

    getSubjects(): Observable<any> {
        return this.http.get<any>(this.url);
    }

    getSubject(id: number): Observable<Subject | undefined> {
        return this.http.get<Subject>(this.url + "/" + id);
      }

    addSubject(data: any): Observable<any> {
        return this.http.post<any>(this.url, data);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file, file.name);
        return this.http.post(this.url + '/uploads', formData);
    }
}