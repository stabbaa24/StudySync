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

  constructor(private usersService: UsersService) { }

  logRole(login: string, password: string) {
    return this.usersService.getRole({ login, password });
  }

  logIn(login: string, password: string) {
    return this.usersService.logInUser({ login, password }).pipe(
      switchMap((userResponse: any) => {
        // Check if authentication is true rather than if there's a message
        if (userResponse.auth) {
          this.loggedIn = true;
          // No need to fetch the role again if you can include it in the login response
          // return this.logRole(login, password);
          this.getUserRole = userResponse.role; // If role is included in login response
          return of(userResponse); // Import `of` from 'rxjs'
        } else {
          this.loggedIn = false;
          return throwError(() => new Error('Login failed'));
        }
      }),
      tap((userResponse: any) => {
        // Assuming role comes with the login response
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
    console.log("L'utilisateur est il admin (auth.service) ? :" + this.getUsers?.role);
    return this.loggedIn && this.getUsers?.role === 'admin';
  }

  register(login: string, password: string, role: string) {
    return this.usersService.registerUser({ login, password, role });
}

}