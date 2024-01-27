import { Component, /*EventEmitter, Output,*/  OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { SubjectsService } from '../../shared/subjects.service';
import { Subject } from 'src/app/subjects/subject.model';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';
import { TeachersService } from 'src/app/shared/teachers.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})

export class AddAssignmentComponent implements OnInit {
  nomDevoir!: string;
  dateDeRendu!: Date;
  groupe!: string;
  matiere!: string;
  promo!: string;
  note = null;
  remarques = null;
  auteur = null;
  subjects!: Subject[];
  getLogin!: string;
  
  constructor(
    private dialogRef: MatDialogRef<AddAssignmentComponent>,
    private assignmentsService: AssignmentsService,
    private subjectService: SubjectsService,
    private authService: AuthService,
    private teachersService: TeachersService
  ) { }

  ngOnInit() {
    this.getLogin = this.authService.getUsers?.login ?? '';
    console.log("Login récupéré:", this.getLogin);
    this.teachersService.getTeacherLogin(this.getLogin).subscribe(teacher => {
      if (teacher) {
        this.auteur = teacher._id;
        console.log("Professeur trouvé pour le login :", this.getLogin);
      } else {
        console.error("Professeur non trouvé pour le login :", this.getLogin);
      }
    });
    this.subjectService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects.docs; 
        console.log("Matieres récupérées:", this.subjects);
      },
      error: (err) => console.error("Erreur lors de la récupération des matières", err)
    });
  }

  onSubmit() {
    const newAssignment = new Assignment();
    newAssignment.id = Math.floor(Math.random() * 1000);
    newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = 0;
    newAssignment.groupe = this.groupe as "TD 1" | "T2" | "TD3";
    newAssignment.promo = this.promo as "L3" | "M1" | "M2";
    newAssignment.auteur = this.auteur;
    console.log("Auteur:", newAssignment.auteur);
    newAssignment.matiere = this.matiere;
    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(message => {
      console.log(message);
      this.dialogRef.close(); 
    });
  }
}