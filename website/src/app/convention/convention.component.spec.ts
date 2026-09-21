import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConventionComponent } from './convention.component';

describe('ConventionComponent', () => {
  let component: ConventionComponent;
  let fixture: ComponentFixture<ConventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConventionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the convention component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle reveal condition correctly', () => {
    // Force mystery
    component.manualRevealOverride.set(false);
    expect(component.isRevealed()).toBeFalse();

    // Force reveal
    component.manualRevealOverride.set(true);
    expect(component.isRevealed()).toBeTrue();
  });

  it('should sanitize input and block links from attendee input field', () => {
    // Try to enter a URL
    component.attendeeInput = 'https://malicious-site.com';
    component.onGenerateTicket();

    expect(component.qrErrorMessage).toContain('Links and URLs are not permitted');

    // Enter a valid name
    component.attendeeInput = 'Ein the Corgi';
    component.onGenerateTicket();

    expect(component.qrErrorMessage).toBe('');
    expect(component.attendeeTicketName).toBe('Ein the Corgi');
    expect(component.qrSvg).toBeTruthy();
    expect(component.qrTargetUrl).toBe('https://www.youtube.com/watch?v=Aq5WXmQQooo');
  });
});
