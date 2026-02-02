import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternosList } from './internos-list';

describe('InternosList', () => {
  let component: InternosList;
  let fixture: ComponentFixture<InternosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
