import { Injectable } from '@angular/core';
import { Users } from '../loggin/loggin.model';
import { UsersService } from './users.service';
import { switchMap, tap, throwError } from 'rxjs';

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
      switchMap((userResponse: any) => { // permet de vérifier si l'utilisateur est bien connecté
        if (userResponse && userResponse.message) {
          this.loggedIn = true;
          return this.logRole(login, password); // permet de récupérer le rôle de l'utilisateur
        } else {
          this.loggedIn = false;
          return throwError(() => new Error('Login failed'));
        }
      }),

      tap((roleResponse: any) => { // permet de récupérer le rôle de l'utilisateur
        this.getUsers = { login, password, role: roleResponse.role };
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
}