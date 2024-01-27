import { Component } from '@angular/core';
import { Subject } from '../subjects/subject.model';
import { SubjectsService } from '../shared/subjects.service';

@Component({
  selector: 'app-teacher-cards',
  templateUrl: './teacher-cards.component.html',
  styleUrls: ['./teacher-cards.component.css']
})
export class TeacherCardsComponent {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  searchNom: string = '';
  searchPrenom: string = '';
  selectedMatiere: string = '';

  constructor(private subjectsService: SubjectsService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectsService.getSubjects().subscribe(
      subjects => {
        this.subjects = subjects.docs;
        this.filteredSubjects = [...this.subjects]; // Copie initiale
      },
      error => console.error('Erreur recup matières', error)
    );
  }

  applyFilters() {
    this.filteredSubjects = this.subjects.filter(subject => {
      const teacher = subject.professeurDetails;
      return (!this.selectedMatiere || subject.matiere === this.selectedMatiere) &&
             (!this.searchNom || (teacher && teacher.nom.toLowerCase().includes(this.searchNom.toLowerCase()))) &&
             (!this.searchPrenom || (teacher && teacher.prenom.toLowerCase().includes(this.searchPrenom.toLowerCase())));
    });
  }

  onMatiereChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedMatiere = select.value;
    this.applyFilters();
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
}
