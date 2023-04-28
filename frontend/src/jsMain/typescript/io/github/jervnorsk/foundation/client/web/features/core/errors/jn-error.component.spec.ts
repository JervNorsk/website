import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JnErrorComponent } from './jn-error.component';

describe('JnErrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
          JnErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(JnErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
