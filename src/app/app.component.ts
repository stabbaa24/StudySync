import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { AssignmentsService } from './shared/assignments.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Application de gestion des devoirs à rendre (Assignments)';

  constructor(public authService: AuthService, private router: Router, 
    private assignmentsService: AssignmentsService) { }

  get username(): string | null {
    return this.authService.getUsers ? this.authService.getUsers.login : null;
  }

  onLogginForm() {
    this.router.navigate(["/loggin"]);
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(["/home"]);
  }

  /*onPeuplerBD() {
    this.assignmentsService.peuplerBD();
  }*/
}
