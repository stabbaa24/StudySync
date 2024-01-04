import { Component, ViewChild } from '@angular/core';
import { SubjectsService } from '../shared/subjects.service';
import { Subject } from './subject.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent {
  titre = "Liste des Matières";
  subjects!: Subject[];
  getUploadedImage = "../../../";
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  
  constructor(private subjectsService: SubjectsService) { }

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

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.subjectsService.getSubjects().
      subscribe(data => {
        this.subjects = data.docs;
        console.log(this.subjects);
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