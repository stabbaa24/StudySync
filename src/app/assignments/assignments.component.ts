import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { StudentsService } from '../shared/students.service';
import { RenderedService } from '../shared/rendered.service';
import { SubjectsService } from '../shared/subjects.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin, of } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject } from '../subjects/subject.model'
import { MatDialog } from '@angular/material/dialog';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { Render } from './render.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class AssignmentsComponent implements OnInit {
  titre = "Rendu des devoirs";
  formVisible = false;
  assignmentTransmis!: Assignment | null;
  assignments!: Assignment[];
  columnsToDisplay = ['matiere', 'nom', 'dateDeRendu', 'groupe', 'promo', 'rendu'];
  expandedAssignment: Assignment | null = null;
  getLogin: string = '';
  groupeEtudiant: string = '';
  promoEtudiant: string = '';
  rendered: Render[] = [];
  isRendered: boolean | null = null;
  matieres: string[] = [];
  loadingRenders = true;
  rendersMap = new Map<string, boolean>();
  filteredAssignments!: Assignment[];
  searchText: string = '';
  selectedMatiere: string = '';
  selectedStatus: string = 'all';
  matiereIdMap: Record<string, string> = {}; //https://www.danywalls.com/how-to-use-record-type-in-typescript
  nbStudent: Record<string, number> = {}; // Clé pourrait être 'Promo-GroupeTD'

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  //Gérer la pagination
  page: number = 1;
  limit: number = 10;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasPrevPage: boolean = true;
  hasNextPage!: boolean;
  pagingCounter!: number;
  hasPrevPageInUrl!: boolean;
  hasNextPageInUrl!: boolean;
  prevPageInUrl!: number;
  nextPageInUrl!: number;


  constructor(
    private dialog: MatDialog,
    private assignmentsService: AssignmentsService,
    private router: Router,
    private authService: AuthService,
    private studentsService: StudentsService,
    private renderedService: RenderedService,
    private subjectService: SubjectsService
  ) { }

  ngOnInit(): void {
    this.getLogin = this.authService.getUsers?.login ?? '';
    console.log("La personne loggué est : " + this.getLogin);

    if (this.isAdmin()) {
      this.studentsService.getStudents().subscribe(students => {
        students.forEach((student: { promo: any; groupe: any; }) => {
          const key = `${student.promo}-${student.groupe}`;
          this.nbStudent[key] = (this.nbStudent[key] || 0) + 1;
        });

        console.log("Nombre d'étudiants par groupe et promo:", this.nbStudent);
      });
    }

    this.subjectService.getSubjects().subscribe({
      next: (subjects) => {
        this.matieres = subjects.docs.map((subject: Subject) => subject.matiere);

        subjects.docs.forEach((subject: Subject) => {
          this.matiereIdMap[subject.matiere] = subject._id as string;
        });
        console.log("Matieres récupérées:", this.matieres);
      },
      error: (err) => console.error("Erreur lors de la récupération des matières", err)
    });

    this.loadPageData();
  }

  loadPageData(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        console.log("data.docs" + data.docs);

        if (this.isAdmin()) {
          this.assignments = data.docs.filter((assignment: { matiereDetails: { professeurDetails: { nom: string; prenom: string; }; }; }) => {
            const getTeacherLog = assignment.matiereDetails.professeurDetails.nom + "." +
              assignment.matiereDetails.professeurDetails.prenom;

            return getTeacherLog === this.getLogin;
          });

          const renderRequests = this.assignments.map(assignment => {
            if (assignment._id) {
              return this.renderedService.getRendersForTeacher(assignment._id);
            } else {
              return of(null);
            }
          });

          //https://rxjs.dev/api/index/function/forkJoin
          forkJoin(renderRequests).subscribe(results => {
            this.rendered = results.flat().filter(render => render !== null);
            this.filterAssignments();
          });

          this.filteredAssignments = [...this.assignments];
        }

        else {
          this.studentsService.getStudents().subscribe(students => {
            const studentLogin = students.find((s: { nom: string; prenom: string; }) =>
              s.nom + '.' + s.prenom === this.getLogin
            );

            if (studentLogin) {
              this.groupeEtudiant = studentLogin.groupe;
              this.promoEtudiant = studentLogin.promo;

              this.assignments = data.docs.filter((assignment: { groupe: string; promo: string; }) =>
                assignment.groupe === this.groupeEtudiant && assignment.promo === this.promoEtudiant
              );

              this.assignments.forEach((assignment: Assignment) => {
                if (assignment._id) {
                  this.renderedService.getRendered(assignment._id, this.getLogin)
                    .subscribe(render => {
                      if (render) {
                        if (render.rendu && assignment._id) {
                          this.rendersMap.set(assignment._id, render.rendu);
                        }
                        this.rendered.push(render);
                        console.log("render", render);
                      } else {
                        console.log(`Aucun rendu pour : ${assignment._id}`);
                      }
                    }, error => {
                      console.error(`Erreur lors de la récupération du rendu pour l'assignment ${assignment._id}: `, error);
                    });
                }
              });

              this.filteredAssignments = [...this.assignments];
            }
          });
        }
        console.log("appel de loadRenders")

        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasPrevPage = data.hasPrevPage;
        this.hasNextPage = data.hasNextPage;
        this.pagingCounter = data.pagingCounter;
        this.hasPrevPageInUrl = data.hasPrevPageInUrl;
        this.hasNextPageInUrl = data.hasNextPageInUrl;
        this.prevPageInUrl = data.prevPageInUrl;
        this.nextPageInUrl = data.nextPageInUrl;

        if (this.paginator) {
          this.paginator.pageIndex = this.page - 1;
        }
      });
  }

  isAssignmentRendered(assignmentId: string | undefined): boolean {
    if (assignmentId === undefined) {
      console.log("assignmentId est undefined");
      return false;
    }
    return this.rendersMap.get(assignmentId) || false;
  }

  assignmentClique(assignment: Assignment) {
    this.toggleExpansion(assignment);
  }

  toggleExpansion(assignment: Assignment) {
    this.expandedAssignment = this.expandedAssignment === assignment ? null : assignment;
  }

  onAssignmentDelete(assignement: Assignment) {
    this.assignmentsService.deleteAssignment(assignement)
      .subscribe(message => {
        console.log(message);
        this.loadPageData();
        this.filterAssignments();
      });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onClickEdit(assignement: Assignment) {
    this.router.navigate(['/assignment', assignement.id, 'edit'],
      { queryParams: { nom: this.assignmentTransmis?.nom }, fragment: 'edition' });
  }

  onChangeAssignmentRendu(assignment: Assignment, $event: any) {
    console.log("Dans onChangeAssignmentRendu");
    console.log(assignment);
    console.log($event.checked);

    if (!this.isAdmin()) {
      const render = {
        assignment: assignment._id,
        student: this.getLogin,
        rendu: $event.checked
      };

      this.renderedService.addRendered(render).subscribe(message => {
        console.log(message);
        this.loadPageData();
      });
    }
  }

  toggleRendered(event: MatSlideToggleChange) {
    this.isRendered = event.checked ? true : null;
    this.filterAssignments();
  }

  filterAssignments() {
    let assignmentRes = [...this.assignments]; // Copie du tableau car sinon on a un pb

    if (this.selectedMatiere) {
      const matiereId = this.matiereIdMap[this.selectedMatiere];
      assignmentRes = assignmentRes.filter(assignment => {
        return assignment.matiere === matiereId;
      });
    }

    if (this.selectedStatus === 'note') {
      if (this.isAdmin()) {
        assignmentRes = assignmentRes.filter(assignment => {
          const renders = this.rendered.filter(r => r.assignment === assignment._id);
          return renders.some(render => render.note !== null);
        });
      }
      else {
        console.log("Dans selectedStatus");
        assignmentRes = assignmentRes.filter(assignment => {

          const render = this.rendered.find(r => r.assignment === assignment._id);
          console.log("render", render);
          return render && render.note !== null
        });
      }
    }


    if (this.isRendered !== null) {
      if (this.isAdmin()) {
        assignmentRes = assignmentRes.filter(assignment => {
          const renders = this.rendered.filter(r => r.assignment === assignment._id);
          return this.isRendered ? renders.length > 0 : renders.length === 0;
        });
      } else {
        assignmentRes = assignmentRes.filter(assignment => {
          const render = assignment._id && this.rendersMap.get(assignment._id);
          return this.isRendered ? render : !render;
        });
      }
    }

    if (this.searchText && this.searchText.trim() !== '') {
      assignmentRes = assignmentRes.filter(assignment =>
        assignment.nom.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredAssignments = assignmentRes;
  }

  getRenderForAssignment(assignmentId: string): Render | undefined {
    return this.rendered.find(r => r.assignment === assignmentId);
  }

  onSearchKeyup(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.applyFilter(input.value);
  }

  applyFilter(filterValue: string) {
    this.searchText = filterValue;
    this.filterAssignments();
  }

  applyPagination() {
    const startIndex = (this.page - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.filteredAssignments = this.assignments.slice(startIndex, endIndex);
  }
  

  onMatiereChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedMatiere = select.value;
    console.log("Matière sélectionnée bitch:", this.selectedMatiere);
    this.filterAssignments();
    this.applyPagination();
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value;
    this.filterAssignments();
  }

  getTotalStudents(groupe: string, promo: string): number {
    const key = `${promo}-${groupe}`;
    return this.nbStudent[key] || 0;
  }

  openAddAssignmentDialog(): void {
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      width: '400px',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(' pop up fermé');
      this.loadPageData();
    });
  }

  openEditAssignmentDialog(assignment: Assignment): void {
    const dialogRef = this.dialog.open(EditAssignmentComponent, {
      width: '400px',
      data: { assignmentId: assignment.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Fenêtre modale fermée');
      this.loadPageData();
    });
  }




  onFirstPage() {
    if (this.page > 1) {
      this.page = 1;
      this.loadPageData();
    }
  }

  onLastPage() {
    if (this.page < this.totalPages) {
      this.page = this.totalPages;
      this.loadPageData();
    }
  }

  onPaginateChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadPageData();
    this.applyPagination();
  }
}