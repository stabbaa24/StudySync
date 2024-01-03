import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectsService } from '../../shared/subjects.service';
import { TeachersService } from '../../shared/teachers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})

export class AddSubjectComponent {
  subjectForm = new FormGroup({
    matiere: new FormControl('', Validators.required),
    professeur: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });

  file: File | null = null;
  teachers: any[] = [];
  imgFolder = 'assets/uploads/';

  constructor(
    private router: Router,
    private subjectService: SubjectsService,
    private teacherService: TeachersService
  ) { }

  ngOnInit() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => this.teachers = teachers,
      error: (err) => console.error("Erreur lors de la récupération des professeurs", err)
    });
  }

  onAddSubject() {
    if (!this.subjectForm.valid) {
      console.log('Formulaire non valide');
      return;
    }

    const addSubject = (imagePath: string | undefined) => {

      const data = {
        matiere: this.getMatiere?.value,
        image_matiere: imagePath,
        professeur: this.getProfesseur?.value
      };

      this.subjectService.addSubject(data).subscribe({
        next: () => this.router.navigate(['/subjects']),
        error: (error) => console.error('Matière add KO : ', error)
      });
    };

    if (this.file) {
      const upload = this.subjectService.uploadImage(this.file);
      upload.subscribe({
        next: (getImg) => {
          addSubject(this.imgFolder + getImg.fileName);
        },
        error: (error) => {
          console.error('Erreur chargement img ', error);
          addSubject('');
        }
      });
    } else {
      addSubject('');
    }
  }

  //https://blog.angular-university.io/angular-file-upload/
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.subjectForm.get('image')?.setValue(this.file.name);
    }
  }

  get getMatiere() { return this.subjectForm.get('matiere'); }
  get getProfesseur() { return this.subjectForm.get('professeur'); }
  get getImage() { return this.subjectForm.get('image'); }
}
