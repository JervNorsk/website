import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JnStreamingAppComponent } from './jn-streaming-app.component';

describe('JnStreamingAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        JnStreamingAppComponent
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(JnStreamingAppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
