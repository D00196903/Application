import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChatPage } from './chat.page';
import { Chat } from '../models/chat.model';
import { of } from 'rxjs';
import * as uuid from 'uuid';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

describe('ChatPage', () => {
  let component: ChatPage;
  let fixture: ComponentFixture<ChatPage>;
  let formBuilder: FormBuilder;
  let dbSpy, refSpy, onValueSpy, pushSpy: jasmine.Spy<jasmine.Func>, setSpy: jasmine.Spy<jasmine.Func>, uuidSpy;

  describe('ChatPage', () => {
    let component: ChatPage;
    let fixture: ComponentFixture<ChatPage>;
    let formBuilder: FormBuilder;
    let dbSpy, refSpy, onValueSpy, pushSpy: jasmine.Spy<jasmine.Func>, setSpy: jasmine.Spy<jasmine.Func>, uuidSpy;

    beforeEach(async () => {
      uuidSpy = spyOn(uuid, 'v4').and.returnValue('mock-uuid');
      dbSpy = jasmine.createSpy('database');
      refSpy = jasmine.createSpy('ref').and.returnValue({});
      onValueSpy = jasmine.createSpy('onValue').and.returnValue(of({}));
      pushSpy = jasmine.createSpy('push').and.returnValue({});
      setSpy = jasmine.createSpy('set').and.returnValue(Promise.resolve());

      await TestBed.configureTestingModule({
        declarations: [ChatPage],
        providers: [
          FormBuilder,
          { provide: getDatabase, useValue: dbSpy },
          { provide: ref, useValue: refSpy },
          { provide: onValue, useValue: onValueSpy },
          { provide: push, useValue: pushSpy },
          { provide: set, useValue: setSpy },
        ],
        imports: [ReactiveFormsModule]
      }).compileComponents();

      Object.defineProperty(uuid, 'v4', { value: () => 'mock-uuid' });

      fixture = TestBed.createComponent(ChatPage);
      component = fixture.componentInstance;
      formBuilder = TestBed.inject(FormBuilder);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
      const formGroup = formBuilder.group({
        'message': [],
        'username': []
      });
      expect(component.form.value).toEqual(formGroup.value);
    });

    it('should submit chat', () => {
      const dateSpy = spyOn(Date, 'now').and.returnValue(1620130800000); // mock Date
      const chat: Chat = {
        message: 'Hello',
        username: 'testUser1',
        timestamp: new Date(dateSpy()),
        id: 'mock-uuid',
      };
      const form = {
        message: 'Hello testuser1',
        username: 'testUser2'
      };
      component.onChatSubmit(form);
      expect(uuid.v4).toHaveBeenCalled();
      expect(pushSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalled();
    });
  });
});