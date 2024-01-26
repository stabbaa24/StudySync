import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCardsComponent } from './student-cards.component';

describe('StudentCardsComponent', () => {
  let component: StudentCardsComponent;
  let fixture: ComponentFixture<StudentCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCardsComponent]
    });
    fixture = TestBed.createComponent(StudentCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
