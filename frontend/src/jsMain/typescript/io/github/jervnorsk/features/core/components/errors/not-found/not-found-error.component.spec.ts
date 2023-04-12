import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundErrorComponent } from './not-found-error.component';

describe('PageNotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NotFoundErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NotFoundErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
