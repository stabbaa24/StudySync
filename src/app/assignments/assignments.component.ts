import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatPaginator } from '@angular/material/paginator';

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
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

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

  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).
      subscribe(data => {
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

  getAssignments() {
    this.assignmentsService.getAssignments()
      .subscribe(assignments => {
        this.assignments = assignments;
      });
  }

  assignmentClique(assignment: Assignment) {
    //console.log("Assignment cliqué : " + assignment.nom);
    this.assignmentSelectionne = assignment;
  }

  onAddAssignmentBtnClick() {
    //this.formVisible = true;
  }

  onNouvelAssignment(event: Assignment) {

    /*this.assignmentsService.addAssignment(event)
      .subscribe(message => {
        console.log(message);
        //this.getAssignments();
      });

      this.formVisible = false;*/
  }

  onDeleteAssignment(event: Assignment) {
    const index = this.assignments.indexOf(event);
    if (index > -1) {
      this.assignments.splice(index, 1);
    }
    this.assignmentSelectionne = null;
  }

  //Gérer la pagination
  /*onPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPageData();
    }
  }

  onNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPageData();
    }
  }*/

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