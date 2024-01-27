import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { AssignmentsComponent } from './assignments/assignments.component';
import { RenduDirective } from './shared/rendu.directive';
import {FormsModule} from "@angular/forms";
import { AssigmentDetailComponent } from './assignments/assigment-detail/assigment-detail.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { RouterModule, Routes } from '@angular/router';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';

import { authGuard } from './shared/auth.guard';
import { FormLogginComponent } from './loggin/form-loggin/form-loggin.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HomeComponent } from './home/home.component';
import { LoadComponent } from './load/load.component';
import { RegisterComponent } from './loggin/register/register.component';

import {MatRadioModule} from '@angular/material/radio';
import { AuthInterceptor } from './shared/auth.interceptor';
import { SubjectsComponent } from './subjects/subjects.component';
import { AddSubjectComponent } from './subjects/add-subject/add-subject.component';

import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentCardsComponent } from './student-cards/student-cards.component';
import { TeacherCardsComponent } from './teacher-cards/teacher-cards.component';
import { AssignmentCalendarComponent } from './assignments/assignment-calendar/assignment-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const routes: Routes = [
  //{ path: 'load', component: LoadComponent },
  { path: '', component: HomeComponent },
  //{ path: '', component: AssignmentsComponent }, // path vide = page d'accueil
  { path: 'home', component: AssignmentsComponent },
  { path: 'add', component: AddAssignmentComponent },
  { path: 'assignment/:id', component: AssigmentDetailComponent},
  {
    path: 'assignment/:id/edit',
    component: EditAssignmentComponent,
    canActivate: [authGuard]
  },
  { path: 'loggin', component: FormLogginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'addSubject', component: AddSubjectComponent },
  { path: 'students', component: StudentCardsComponent },
  { path: 'teachers', component: TeacherCardsComponent },
  { path: 'calendar', component: AssignmentCalendarComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AssignmentsComponent,
    RenduDirective,
    AssigmentDetailComponent,
    AddAssignmentComponent,
    EditAssignmentComponent,
    FormLogginComponent,
    HomeComponent,
    LoadComponent,
    RegisterComponent,
    SubjectsComponent,
    AddSubjectComponent,
    StudentCardsComponent,
    TeacherCardsComponent,
    AssignmentCalendarComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    RouterModule.forRoot(routes),
    MatSlideToggleModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatDialogModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }