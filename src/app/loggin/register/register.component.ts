import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) { }

  registerForm = new FormGroup({
    role: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  isRegisterFailed = false;
  getErrorRegister = 'Nom d\'utilisateur ou mot de passe incorrect.';
  getErrorRegisterUsername = 'Nom d\'utilisateur déjà utilisé.';

  ngOnInit(): void {
    console.log(this.registerForm);
  }

  onRegister() {
    if (this.registerForm.valid) {
      const role = this.registerForm.value.role ?? 'user'; // Récupérer le rôle
      const username = this.registerForm.value.username ?? '';
      const password = this.registerForm.value.password ?? '';
      const confirmPassword = this.registerForm.value.confirmPassword ?? '';
  
      if (password === confirmPassword) {
        this.authService.register(username, password, role).subscribe({
          next: () => {
            this.router.navigate(['/loggin']);
          },
          error: (error) => {
            console.error(error);
            this.isRegisterFailed = true;
          }
        });
      }
      else {
        this.isRegisterFailed = true;
        this.getErrorRegister = 'Les mots de passe ne correspondent pas.';
      }
    }
  }

  get getUsername() { return this.registerForm.get('username'); }
  get getPassword() { return this.registerForm.get('password'); }
  get getConfirmPassword() { return this.registerForm.get('confirmPassword'); }
}
