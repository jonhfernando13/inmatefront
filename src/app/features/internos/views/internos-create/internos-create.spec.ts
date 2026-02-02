import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternoCreateComponent } from './internos-create';

describe('InternoCreateComponent', () => {
  let component: InternoCreateComponent;
  let fixture: ComponentFixture<InternoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternoCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
