import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlaneComponent } from './edit-plane.component';

describe('EditPlaneComponent', () => {
  let component: EditPlaneComponent;
  let fixture: ComponentFixture<EditPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
