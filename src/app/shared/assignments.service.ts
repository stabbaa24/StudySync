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

  constructor(private loggingService: LoggingService,
    private http: HttpClient) { }

  url = "http://localhost:8010/api/assignments";
  getAssignments(): Observable<Assignment[]> {
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url); // renvoie un Observable
  }

  // renvoie comme Observable l'assignment dont l'id est passé
  // en paramètre, ou undefined s'il n'existe pas
  getAssignment(id: number): Observable<Assignment | undefined> {
    //const a:Assignment | undefined = this.assignments. find(a => a.id === id);
    //return of(a);
    return this.http.get<Assignment>(this.url + "/" + id);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    /*this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");
    return of("Assignment ajouté !");*/
    return this.http.post<Assignment>(this.url, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    //return of("Assignment service: assignment modifié !");
    return this.http.put<Assignment>(this.url, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    /*let pos = this.assignments.indexOf(assignment);
    this.assignments.splice(pos, 1);

    return of("Assignment service: assignmentsupprimé !");*/
    let deleteURI = this.url + "/" + assignment._id;
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
