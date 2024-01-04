import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})

export class AssignmentsComponent implements OnInit {
  titre = "Rendu des devoirs";
  formVisible = false;
  assignmentSelectionne!: Assignment | null;
  assignments!: Assignment[];
  columnsToDisplay = ['matiere', 'nom', 'dateDeRendu', 'groupe', 'promo', 'rendu'];

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
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loadPageData();
    console.log("assignments.component.ts");
  }

  loadPageData(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).
      subscribe(data => {
        console.log("Dans loadPageData : ");
        console.log(data);
        this.assignments = data.docs;
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
      }
      );
  }

  assignmentClique(assignment: Assignment) {
    this.router.navigate(['/assignment', assignment.id]);
    console.log("Assignment cliqué : " + assignment.nom + " " + assignment.id);
    this.assignmentSelectionne = assignment;
  }

  onFirstPage() {
    if (this.page > 1) {
      this.page = 1;
      this.loadPageData();
    }
  }

  onLastPage() {
    if(this.page < this.totalPages) {
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