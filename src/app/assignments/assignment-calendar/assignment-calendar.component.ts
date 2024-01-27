import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { SubjectsService } from 'src/app/shared/subjects.service';
import { Subject } from 'src/app/subjects/subject.model';

@Component({
  selector: 'app-assignment-calendar',
  templateUrl: './assignment-calendar.component.html',
  styleUrls: ['./assignment-calendar.component.css']
})
//https://mattlewis-github.com/angular-calendar/#/kitchen-sink
//https://www.npmjs.com/package/angular-calendar
export class AssignmentCalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  assignments: Assignment[] = [];
  constructor(
    private assignmentsService: AssignmentsService,
    private subjectsService: SubjectsService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentsService.getAssignments().subscribe((response: any) => {
      this.assignments = response.docs;

      this.assignments.forEach(assignment => {
        const subject = assignment.matiereDetails;
        this.events.push({
          start: new Date(assignment.dateDeRendu),
          title: `${assignment.nom} - ${subject?.matiere}`
        });
      });

      this.forceUpdateCalendarView();
    }, error => {
      console.error('Erreur lors de la récupération des assignments', error);
    });
  }

  forceUpdateCalendarView(): void {
    const currentDate = new Date(this.viewDate);
    this.viewDate = new Date(1970, 0, 1); 
    this.cdr.detectChanges();
    this.viewDate = currentDate;
    this.cdr.detectChanges();
  }
  
  previousMonth(): void {
    const prevMonth = new Date(this.viewDate);
    prevMonth.setMonth(this.viewDate.getMonth() - 1);
    this.viewDate = prevMonth;
  }
  
  nextMonth(): void {
    const nextMonth = new Date(this.viewDate);
    nextMonth.setMonth(this.viewDate.getMonth() + 1);
    this.viewDate = nextMonth;
  }
  
  
}
