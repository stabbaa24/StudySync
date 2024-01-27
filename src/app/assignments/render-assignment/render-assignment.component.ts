import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from '../../shared/assignments.service';
import { RenderedService } from '../../shared/rendered.service';
import { Assignment } from '../../assignments/assignment.model';
import { Render } from '../render.model';

@Component({
  selector: 'app-render-assignment',
  templateUrl: './render-assignment.component.html',
  styleUrls: ['./render-assignment.component.css']
})
export class RenderAssignmentComponent implements OnInit {
  assignments: Assignment[] = [];
  rendersMap = new Map<string, Render[]>();

  constructor(
    private assignmentsService: AssignmentsService,
    private renderedService: RenderedService
  ) { }

  ngOnInit(): void {
    
  }

  
}
