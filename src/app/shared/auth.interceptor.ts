import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
/*
Url utilisé pour la création de ce fichier:
    https://angular.io/guide/http-interceptor-use-cases
    https://docs.angular.lat/api/common/http/HttpInterceptor
    https://angular.io/guide/http-interceptor-use-cases
*/
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isLog()) {
            const token = this.auth.getToken();
            if (token) {
                const authReq = req.clone({
                    headers: req.headers.set('x-access-token', token)
                });
                return next.handle(authReq);
            }
        }
        return next.handle(req);
    }
}