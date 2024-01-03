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
    console.log(this.loginForm);
  }

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.getUsername?.value ?? '';
      const password = this.getPassword?.value ?? '';

      this.authService.logIn(username, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error(error);
          this.isLogFailed = true;
        }
      });
    }
  }

  get getUsername() { return this.loginForm.get('username'); }
  get getPassword() { return this.loginForm.get('password'); }
}
