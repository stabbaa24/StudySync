import { Component, /*Input*/ OnInit, Output, EventEmitter } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { Subject } from 'src/app/subjects/subject.model';

@Component({
  selector: 'app-assigment-detail',
  templateUrl: './assigment-detail.component.html',
  styleUrls: ['./assigment-detail.component.css']
})

export class AssigmentDetailComponent implements OnInit {
    /*@Input()*/ assignmentTransmis!: Assignment | null;
  @Output() deleteAssignment: EventEmitter<Assignment> = new EventEmitter();

  constructor(private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private subject: Subject
    ) { }

  ngOnInit(): void {
    this.getAssignment();
    console.log("getAssignment()" + this.getAssignment);
    console.log("Query Params : ");
    console.log(this.route.snapshot.queryParams);
    console.log("Fragment : ");
    console.log(this.route.snapshot.fragment);
    console.log("transmis : " + this.assignmentTransmis);
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) {
      //this.assignmentTransmis.rendu = true;
    }

    this.assignmentsService.updateAssignment(this.assignmentTransmis!)
      .subscribe(message => {
        console.log(message);
      this.router.navigate(['/home']); //ici pour ne pas risquer d'afficher la page avant que les données soient modifiées
      });
  }

  onAssignmentDelete() {
    this.assignmentsService.deleteAssignment(this.assignmentTransmis!)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
      });
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'],
      { queryParams: { /*nom: this.assignmentTransmis?.nom*/ }, fragment: 'edition' });
  }

  getAssignment() {
    // on recupere l'id dans le snapshot passe par le routeur
    // le "+" force la conversion de l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];
    console.log("id : " + id);
    this.assignmentsService.getAssignment(id)
      .subscribe(assignment => {
        this.assignmentTransmis = assignment || null;
        console.log("transmis : " + this.assignmentTransmis);
        console.log("assignment récupéré : " + assignment);
      });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}

