import { Component, /*EventEmitter, Output,*/  OnInit} from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})

export class AddAssignmentComponent implements OnInit {
  //@Output() nouvelAssignment = new EventEmitter<Assignment>();

  nomDevoir!: string;
  dateDeRendu!: Date;
  
  constructor( private assignmentsService:AssignmentsService ) { }
  
  ngOnInit(): void {
  }

  onSubmit() {
    const newAssignment = new Assignment();
    newAssignment.id = Math.floor(Math.random() * 1000); 
    //newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;

    //this.nouvelAssignment.emit(newAssignment);

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(message => console.log(message));
  }
}