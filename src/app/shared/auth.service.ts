import { Injectable } from '@angular/core';
import { Users } from '../loggin/loggin.model';
import { UsersService } from './users.service';
import { of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  loggedIn = false;
  getUsers: Users | null = null;
  getUserRole: any | null = null;
  token: string | null = null;

  constructor(private usersService: UsersService) { }

  logRole(login: string, password: string) {
    return this.usersService.getRole({ login, password });
  }

  //https://rxjs.dev/api/index/function/switchMap
  //https://rxjs.dev/api/index/function/tap
  logIn(login: string, password: string) {
    return this.usersService.logInUser({ login, password }).pipe(
      switchMap((userResponse: any) => {

        if (userResponse.auth) {
          this.loggedIn = true;

          this.getUserRole = userResponse.role;
          this.token = userResponse.token;
          console.log("token : " + this.token);

          return of(userResponse);
        }

        else {
          this.loggedIn = false;
          return throwError(() => new Error('Login failed'));
        }
      }),
      tap((userResponse: any) => {
        this.getUsers = { login, password, role: userResponse.role };
      })
    );
  }

  logOut() {
    this.loggedIn = false;
    this.getUsers = null;
  }

  isLog(): boolean {
    return this.loggedIn;
  }

  isAdmin(): boolean {
    //console.log("L'utilisateur est il admin (auth.service) ? :" + this.getUsers?.role);
    return this.loggedIn && this.getUsers?.role === 'admin';
  }

  register(username: string, password: string, role: string) {
    return this.usersService.registerUser({ login: username, password, role });
  }

  getToken() {
    return this.token;
  }
}