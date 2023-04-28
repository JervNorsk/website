import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JnWebsiteAppComponent } from './jn-website-app.component';

describe('JnWebsiteAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        JnWebsiteAppComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(JnWebsiteAppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
