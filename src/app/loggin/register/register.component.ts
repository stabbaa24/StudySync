import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/shared/students.service';
import { TeachersService } from 'src/app/shared/teachers.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentsService, // Définir comme propriété privée
    private teacherService: TeachersService  // Définir comme propriété privée
  ) { }

  registerForm = new FormGroup({
    role: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    promo: new FormControl('', Validators.required),
    groupe: new FormControl('', Validators.required)
  });

  isRegisterFailed = false;
  getErrorRegister = 'Nom d\'utilisateur ou mot de passe incorrect.';
  getErrorRegisterUsername = 'Nom d\'utilisateur déjà utilisé.';
  file: File | null = null;
  selectedFileName: string | undefined;
  imgFolder = 'src/assets/uploads/';

  ngOnInit(): void {
    console.log(this.registerForm);
      this.registerForm.get('role')?.valueChanges.subscribe((value) => {
        if (value === 'user') {
          this.registerForm.get('promo')?.setValidators([Validators.required]);
          this.registerForm.get('groupe')?.setValidators([Validators.required]);
        } else {
          this.registerForm.get('promo')?.clearValidators();
          this.registerForm.get('groupe')?.clearValidators();
        }
        this.registerForm.get('promo')?.updateValueAndValidity();
        this.registerForm.get('groupe')?.updateValueAndValidity();
      });
    }

    onRegister() {
      if (!this.registerForm.valid) {
          this.isRegisterFailed = true;
          this.getErrorRegister = 'Formulaire non valide.';
          return;
      }
    
      const role = this.registerForm.value.role ?? 'user';
      const username = this.registerForm.value.username ?? '';
      const password = this.registerForm.value.password ?? '';
      const confirmPassword = this.registerForm.value.confirmPassword ?? '';
      if (password !== confirmPassword) {
          this.isRegisterFailed = true;
          this.getErrorRegister = 'Les mots de passe ne correspondent pas.';
          return;
      }
    
      const performRegistration = () => {
        console.log('selectedFileName : ', this.selectedFileName);
        const additionalData = {
            nom: this.registerForm.value.lastname,
            prenom: this.registerForm.value.firstname,
            image: this.imgFolder + this.selectedFileName,
            promo: role === 'user' ? this.registerForm.value.promo : undefined,
            groupe: role === 'user' ? this.registerForm.value.groupe : undefined,
            idUser: '' // Cet ID sera obtenu après l'inscription
        };
        console.log('additionalData : ', additionalData);
        this.authService.register(username, password, role).subscribe({
            next: (userResponse) => {
                additionalData.idUser = userResponse.id;
                const registerObservable = role === 'user' ? this.studentService.addStudent(additionalData) : this.teacherService.addTeacher(additionalData);
    
                registerObservable.subscribe({
                    next: () => this.router.navigate(['/loggin']),
                    error: (error) => {
                        console.error('Erreur lors de l\'inscription : ', error);
                        this.isRegisterFailed = true;
                    }
                });
            },
            error: (error) => {
                console.error('Erreur lors de l\'inscription : ', error);
                this.isRegisterFailed = true;
            }
        });
      };
    
      // Upload de l'image si elle existe, sinon appel de performRegistration avec un chemin vide
      if (this.file) {
          const uploadObservable = role === 'user' ? this.studentService.uploadImage(this.file) : this.teacherService.uploadImage(this.file);
    
          uploadObservable.subscribe({
              next: (imageResponse) => {
                const imagePath = 'src/assets/uploads/' + imageResponse.fileName; // Supposant que la réponse contient le nom du fichier
                performRegistration();
              },
              error: (error) => {
                  console.error('Erreur lors de l\'upload de l\'image : ', error);
                  this.isRegisterFailed = true;
              }
          });
      } else {
          performRegistration(); // Pas d'image à uploader, donc chemin vide
      }
    }
    
  


    onFileSelected(event: any) {
      this.file = event.target.files[0];
      if (this.file) {
        this.selectedFileName = this.file.name; // Stockez le nom du fichier sélectionné
        this.registerForm.get('image')?.setValue(this.file.name);
      }
    }
    

  get getUsername() { return this.registerForm.get('username'); }
  get getPassword() { return this.registerForm.get('password'); }
  get getConfirmPassword() { return this.registerForm.get('confirmPassword'); }
  get getLastName() { return this.registerForm.get('lastname'); }
  get getFirstName() { return this.registerForm.get('firstname'); }
  get getImage() { return this.registerForm.get('image'); }
  get getPromo() { return this.registerForm.get('promo'); }
  get getGroupe() { return this.registerForm.get('groupe'); }
}
