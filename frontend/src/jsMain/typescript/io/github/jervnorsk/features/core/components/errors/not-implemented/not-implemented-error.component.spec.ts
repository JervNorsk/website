import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotImplementedErrorComponent } from './not-implemented-error.component';

describe('PageNotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NotImplementedErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NotImplementedErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
