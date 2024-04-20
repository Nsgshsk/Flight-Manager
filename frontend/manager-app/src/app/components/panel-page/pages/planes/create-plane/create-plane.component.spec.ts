import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaneComponent } from './create-plane.component';

describe('CreatePlaneComponent', () => {
  let component: CreatePlaneComponent;
  let fixture: ComponentFixture<CreatePlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
