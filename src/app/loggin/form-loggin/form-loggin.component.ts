import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-loggin',
  templateUrl: './form-loggin.component.html',
  styleUrls: ['./form-loggin.component.css']
})
export class FormLogginComponent {
  constructor(private authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  isLogFailed = false;
  getErrorLoggin = 'Nom d\'utilisateur ou mot de passe incorrect.';

  ngOnInit(): void {

  }

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      if (this.authService.logIn(username || '', password || '')) {
        this.router.navigate(['/home']);
      } else {
        this.isLogFailed = true;
      }
    }
  }

  get getUsername() { return this.loginForm.get('username'); }
  get getPassword() { return this.loginForm.get('password'); }

}
