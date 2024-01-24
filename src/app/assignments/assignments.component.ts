import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { UsersService } from '../shared/users.service';
import { TeachersService } from '../shared/teachers.service';
import { StudentsService } from '../shared/students.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
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
  //assignmentSelectionne!: Assignment | null;
  assignments!: Assignment[];
  columnsToDisplay = ['matiere', 'nom', 'dateDeRendu', 'groupe', 'promo', 'rendu'];
  expandedAssignment: Assignment | null = null;
  getLogin: string = '';
  groupeEtudiant: string = '';
  promoEtudiant: string = '';

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
    private assignmentsService: AssignmentsService,
    private router: Router,
    private authService: AuthService,
    private userService: UsersService,
    private teachersService: TeachersService,
    private studentsService: StudentsService,
  ) { }

  ngOnInit(): void {
    this.getLogin = this.authService.getUsers?.login ?? '';
    console.log("La personne loggué est : " + this.getLogin);
    this.loadPageData();
  }


  loadPageData(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        if (this.isAdmin()) {
          this.assignments = data.docs.filter((assignment: { matiereDetails: { professeurDetails: { nom: string; prenom: string; }; }; }) => {
            const getTeacherLog = assignment.matiereDetails.professeurDetails.nom + "." +
              assignment.matiereDetails.professeurDetails.prenom;

            return getTeacherLog === this.getLogin;
          });
        } else {
          this.studentsService.getStudents().subscribe(students => {
            const student = students.find((s: { nom: string; prenom: string; }) => 
              (s.nom + '.' + s.prenom) === this.getLogin);
        
            if (student) {
              this.groupeEtudiant = student.groupe;
              this.promoEtudiant = student.promo;

              this.assignments = data.docs.filter((assignment: { groupe: string; promo: string; }) => {
                return assignment.groupe === this.groupeEtudiant && assignment.promo === this.promoEtudiant;
              });
            }
          });
        }

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

  assignmentClique(assignment: Assignment) {
    this.toggleExpansion(assignment);
  }

  toggleExpansion(assignment: Assignment) {
    this.expandedAssignment = this.expandedAssignment === assignment ? null : assignment;
  }

  onAssignmentDelete(assignement: Assignment) {
    /*
    this.assignmentsService.deleteAssignment(this.assignmentTransmis!)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
      });
  }
    
    */
    this.assignmentsService.deleteAssignment(assignement)
      .subscribe(message => {
        console.log(message);
        this.loadPageData();
      });
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /*
  onClickEdit() {
   this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'],
     { queryParams: {*/ /*nom: this.assignmentTransmis?.nom }, fragment: 'edition' });
}*/

  onClickEdit(assignement: Assignment) {
    this.router.navigate(['/assignment', assignement._id, 'edit'],
      { queryParams: { /*nom: this.assignmentTransmis?.nom*/ }, fragment: 'edition' });
  }

  //onChangeAssignmentRendu(assignment, $event.checked
  onChangeAssignmentRendu(assignment: Assignment, $event: any) {
    console.log("Dans onChangeAssignmentRendu");
    console.log(assignment);
    console.log($event.checked);
    assignment.rendu = $event.checked;
    this.assignmentsService.updateAssignment(assignment)
      .subscribe(message => {
        console.log(message);
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
  }
}