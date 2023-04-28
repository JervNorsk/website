import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JnNotFoundErrorComponent } from './jn-not-found-error.component';

describe('JnNotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        JnNotFoundErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(JnNotFoundErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
