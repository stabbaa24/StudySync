import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectsService } from '../shared/subjects.service';
import { TeachersService } from '../shared/teachers.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent {
  subjectForm = new FormGroup({
    matiere: new FormControl('', Validators.required),
    professeur: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });

  file: File | null = null;
  teachers: any[] = [];
  selectedFileName: string | undefined;
  imgFolder = 'src/assets/uploads/';

  constructor(private subjectService: SubjectsService, private teacherService: TeachersService) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => this.teachers = teachers,
      error: (err) => console.error("Erreur lors de la récupération des professeurs", err)
    });
  }

  /*onAddSubject() {
    if (this.subjectForm.invalid) {
      return;
    }
  
    const performAddSubject = () => {
      const formData = new FormData();
      formData.append('matiere', this.subjectForm.value.matiere ?? '');
      formData.append('professeur', this.subjectForm.value.professeur ?? '');
      formData.append('image_matiere', this.imgFolder + this.selectedFileName ?? '');
      console.log(formData);
      this.subjectService.addSubject(formData).subscribe({
        next: () => console.log("Matière ajoutée avec succès"),
        error: (err) => console.error("Erreur lors de l'ajout de la matière", err)
      });
    };
  
    if (this.file) {
      const uploadObservable = this.subjectService.uploadImage(this.file);
      uploadObservable.subscribe({
        next: (imageResponse) => {
          performAddSubject();
        },
        error: (error) => {
          console.error('Erreur lors de l\'upload de l\'image : ', error);
        }
      });
    } else {
      // Si aucune image n'est fournie, appeler performAddSubject avec un chemin vide ou un chemin par défaut
      performAddSubject();
    }
  }*/

  onAddSubject() {
    if (!this.subjectForm.valid) {
      console.log('Formulaire non valide');
      return;
    }
  
    const performAddSubject = (imagePath: string | undefined) => {
      
      const additionalData = {
        matiere: this.subjectForm.value.matiere,
        image_matiere: this.imgFolder + this.selectedFileName,
        professeur: this.subjectForm.value.professeur
    };
     
      this.subjectService.addSubject(additionalData).subscribe({
        next: () => console.log('Matière ajoutée avec succès'),
        error: (error) => console.error('Erreur lors de l\'ajout de la matière : ', error)
      });
    };
  
    if (this.file) {
      const uploadObservable = this.subjectService.uploadImage(this.file);
      uploadObservable.subscribe({
        next: (imageResponse) => {
          const imagePath = 'src/assets/uploads/' + imageResponse.fileName; // ou tout autre chemin que vous recevez
          performAddSubject(imagePath);
        },
        error: (error) => {
          console.error('Erreur lors de l\'upload de l\'image : ', error);
          performAddSubject(''); // Gérer l'erreur et appeler la fonction même sans l'image
        }
      });
    } else {
      performAddSubject(''); // Pas de fichier à uploader
    }
  }
  
  

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.subjectForm.get('image')?.setValue(this.file.name);
      this.selectedFileName = this.file.name;
      console.log('selectedFileName : ', this.selectedFileName);
    }
  }

  get getMatiere() { return this.subjectForm.get('matiere'); }
  get getProfesseur() { return this.subjectForm.get('professeur'); }
  get getImage() { return this.subjectForm.get('image'); }
}