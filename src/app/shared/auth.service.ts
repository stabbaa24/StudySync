import { Injectable } from '@angular/core';
import { Users } from '../loggin/loggin.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  loggedIn = false;
  getUsers: Users | null = null;
  
  users: Users[] = [
    { login: 'user1', password: 'pass1', role: 'user' },
    { login: 'user2', password: 'pass2', role: 'user' },
    { login: 'user3', password: 'pass3', role: 'admin' }
  ];

  logIn(login: string, password: string): boolean {
    const user = this.users.find(u => u.login === login && u.password === password);
    if (user) {
      this.getUsers = user;
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logOut() {
    this.loggedIn = false;
    this.getUsers = null;
  }

  isLog(): Promise<boolean> {
    return Promise.resolve(this.loggedIn);
  }

  isAdmin(): Promise<boolean> {
    return this.isLog().then(isLoggedIn => {
      return isLoggedIn && this.getUsers?.role === 'admin';
    });
  }

  isAdminSync(): boolean {
      return this.loggedIn && this.getUsers?.role === 'admin';
  }
  constructor() { }
}