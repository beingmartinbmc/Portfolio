import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AiFaceComponent } from './ai-face.component';
import { environment } from '../../environments/environment';

describe('AiFaceComponent', () => {
  let component: AiFaceComponent;
  let fixture: ComponentFixture<AiFaceComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFaceComponent, HttpClientTestingModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AiFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    component.ngOnDestroy();
  });

  it('should create with a welcome message', () => {
    expect(component).toBeTruthy();
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].isUser).toBeFalse();
  });

  it('toggleChat opens and closes the chat panel', () => {
    expect(component.isChatOpen).toBeFalse();
    component.toggleChat();
    expect(component.isChatOpen).toBeTrue();
    expect(component.hasNewMessage).toBeFalse();
    component.toggleChat();
    expect(component.isChatOpen).toBeFalse();
  });

  it('escape key closes an open chat', () => {
    component.isChatOpen = true;
    component.onEscapeKey();
    expect(component.isChatOpen).toBeFalse();
  });

  it('escape key does nothing when the chat is closed', () => {
    component.isChatOpen = false;
    component.onEscapeKey();
    expect(component.isChatOpen).toBeFalse();
  });

  it('sendMessage ignores empty input', fakeAsync(() => {
    component.userInput = '   ';
    component.sendMessage();
    tick();
    httpMock.expectNone(environment.aiApiUrl);
  }));

  it('sendMessage posts to the API and renders the AI reply', fakeAsync(() => {
    component.userInput = 'What do you do?';
    component.sendMessage();

    const req = httpMock.expectOne(environment.aiApiUrl);
    expect(component.isTyping).toBeTrue();
    req.flush({ choices: [{ message: { content: 'I build backends.' } }] });

    tick(500); // typing delay
    expect(component.messages.some(m => m.text === 'I build backends.')).toBeTrue();
    expect(component.isTyping).toBeFalse();
    tick(2000); // talking animation timeout
  }));

  it('sendMessage shows an error message when the API fails', fakeAsync(() => {
    component.userInput = 'hello';
    component.sendMessage();

    const req = httpMock.expectOne(environment.aiApiUrl);
    req.flush('boom', { status: 500, statusText: 'Server Error' });

    tick(2000);
    expect(component.messages.some(m => m.text.includes('went wrong'))).toBeTrue();
    expect(component.isTyping).toBeFalse();
  }));

  it('falls back to a default message when the response has no text', fakeAsync(() => {
    component.userInput = 'hi';
    component.sendMessage();
    const req = httpMock.expectOne(environment.aiApiUrl);
    req.flush({ choices: [] });
    tick(500);
    expect(component.messages.some(m => m.text.includes("couldn't process"))).toBeTrue();
    tick(2000);
  }));

  it('mouse-move updates pupils when an svg with pupils is present', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'demo');
    const container = document.createElement('div');
    container.className = 'ai-face-container';
    const lp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    lp.id = 'left-pupil';
    const rp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rp.id = 'right-pupil';
    svg.appendChild(lp);
    svg.appendChild(rp);
    container.appendChild(svg);
    document.body.appendChild(container);

    component.isTyping = false;
    component.isTalking = false;
    expect(() => component.onMouseMove(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }))).not.toThrow();

    document.body.removeChild(container);
  });

  it('mouse-move is ignored while typing or talking', () => {
    component.isTyping = true;
    expect(() => component.onMouseMove(new MouseEvent('mousemove'))).not.toThrow();
  });

  it('ngOnDestroy clears the blink interval', () => {
    component.ngAfterViewInit();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
