import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { Users } from '../loggin/loggin.model';

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    constructor(private loggingService: LoggingService,
        private http: HttpClient) { }

    url = "http://localhost:8010/api/users";

    logInUser(users: { login: string, password: string }): Observable<any> {
        return this.http.post<any>(this.url + '/login', users);
    }

    getUsers(): Observable<Users[]> {
        return this.http.get<Users[]>(this.url);
    }

    getRole(users: { login: string, password: string }): Observable<any> {
        return this.http.post<any>(this.url + '/role', users);
    }
    
}