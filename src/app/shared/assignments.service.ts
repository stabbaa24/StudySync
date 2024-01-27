import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { bdInitialAssignments } from './data';

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  getSubjects() {
    throw new Error('Method not implemented.');
  }

  constructor(private loggingService: LoggingService,
    private http: HttpClient) { }

  url = "http://localhost:8010/api/assignments";

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.url); // renvoie un Observable
  }


  getAssignment(id: number): Observable<Assignment | undefined> {
    // Assurez-vous que l'URL est correctement formée et que 'id' n'est pas undefined
    const url = `${this.url}/${id}`;
    console.log('Appel API avec URL:', url);
    return this.http.get<Assignment>(url);
  }


  addAssignment(assignment: Assignment): Observable<any> {
    return this.http.post<Assignment>(this.url, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    return this.http.put<Assignment>(this.url, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    const deleteURI = this.url + "/" + assignment._id; // Assurez-vous que _id est correct
    return this.http.delete(deleteURI);
  }

  /*peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.id = a.id;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      this.addAssignment(nouvelAssignment)
        .subscribe(reponse => {
          console.log(reponse.message);
        })
    })
  }*/

  getAssignmentsPagine(page: number, limit: number): Observable<any> {
    return this.http.get<any>(this.url + "?page=" + page + "&limit=" + limit);
  }

}
