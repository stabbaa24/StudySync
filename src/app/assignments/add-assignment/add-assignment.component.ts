import { Component, /*EventEmitter, Output,*/  OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { SubjectsService } from '../../shared/subjects.service';
import { Subject } from 'src/app/subjects/subject.model';

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

  constructor(
    private assignmentsService: AssignmentsService,
    private subjectService: SubjectsService
  ) { }

  ngOnInit() {
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
    newAssignment.rendu = false;
    newAssignment.groupe = this.groupe as "TD 1" | "T2" | "TD3";
    newAssignment.promo = this.promo as "L3" | "M1" | "M2";
    newAssignment.note = this.note;
    newAssignment.remarques = this.remarques;
    newAssignment.auteur = this.auteur;
    newAssignment.matiere = this.matiere;
    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(message => console.log(message));
  }
}