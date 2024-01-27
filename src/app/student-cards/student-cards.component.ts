import { Component, OnInit } from '@angular/core';
import { Student } from '../assignments/student.model';
import { StudentsService } from '../shared/students.service';

@Component({
  selector: 'app-student-cards',
  templateUrl: './student-cards.component.html',
  styleUrls: ['./student-cards.component.css']
})

//https://v10.material.angular.io/components/card/examples
export class StudentCardsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchNom: string = '';
  searchPrenom: string = '';
  selectedPromo: string = '';
  selectedGroupe: string = '';
  
  constructor(private studentsService: StudentsService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentsService.getStudents().subscribe(
      students => {
        this.students = students;
        this.filteredStudents = [...this.students]; // Copie initiale
      },
      error => console.error('Erreur recup etudiant', error)
    );
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      return student.nom.toLowerCase().includes(this.searchNom.toLowerCase()) &&
             student.prenom.toLowerCase().includes(this.searchPrenom.toLowerCase()) &&
             (!this.selectedPromo || student.promo === this.selectedPromo) &&
             (!this.selectedGroupe || student.groupe === this.selectedGroupe);
    });
  }

  onSearchNomChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchNom = input.value;
    this.applyFilters();
  }

  onSearchPrenomChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchPrenom = input.value;
    this.applyFilters();
  }

  onPromoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedPromo = select.value;
    this.applyFilters();
  }

  onGroupeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedGroupe = select.value;
    this.applyFilters();
  }
}
