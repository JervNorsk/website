import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JnNotImplementedErrorComponent } from './jn-not-implemented-error.component';

describe('JnNotImplementedErrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        JnNotImplementedErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(JnNotImplementedErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
