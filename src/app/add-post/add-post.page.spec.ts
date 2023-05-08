import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AddPostPage } from './add-post.page';

describe('AddPostPage', () => {
  let component: AddPostPage;
  let fixture: ComponentFixture<AddPostPage>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let angularFirestoreSpy: jasmine.SpyObj<AngularFirestore>;

  beforeEach(async () => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    angularFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);

    await TestBed.configureTestingModule({
      declarations: [AddPostPage],
      providers: [
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: AngularFirestore, useValue: angularFirestoreSpy },
      ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formValidation', () => {
    it('should return false if title is not provided', () => {
      component.event = { title: '', location: 'Drogheda', details: 'Party at the park' };
      expect(component.formValidation()).toBeFalsy();
      expect(toastControllerSpy.create).toHaveBeenCalled();
    });

    it('should return false if location is not provided', () => {
      component.event = { title: 'Park Party', location: '', details: 'Party at the park' };
      expect(component.formValidation()).toBeFalsy();
      expect(toastControllerSpy.create).toHaveBeenCalled();
    });

    it('should return false if details are not provided', () => {
      component.event = { title: 'Park Party', location: '', details: '' };
      expect(component.formValidation()).toBeFalsy();
      expect(toastControllerSpy.create).toHaveBeenCalled();
    });

    it('should return true if all fields are provided', () => {
      component.event = { title: 'Park Party', location: 'New York', details: 'Party at the park' };
      expect(component.formValidation()).toBeTruthy();
      expect(toastControllerSpy.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('createEvent', () => {
    beforeEach(() => {
      spyOn(component, 'formValidation').and.returnValue(true);
    });

    it('should not call Firestore if form validation fails', async () => {
      component.formValidation = jasmine.createSpy().and.returnValue(false);
      await component.createEvent(component.event);
      expect(angularFirestoreSpy.collection).toHaveBeenCalledTimes(0);
      expect(loadingControllerSpy.create).toHaveBeenCalledTimes(0);
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
    });

    it('should call Firestore and navigate to "show" page if form validation succeeds', async () => {
      const loaderSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve
        (loaderSpy));
      const eventCollectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['add']);
      angularFirestoreSpy.collection.and.returnValue(eventCollectionSpy);

      await component.createEvent(component.event);

      expect(component.formValidation).toHaveBeenCalled();
      expect(loadingControllerSpy.create).toHaveBeenCalled();
      expect(loaderSpy.present).toHaveBeenCalled();
      expect(angularFirestoreSpy.collection).toHaveBeenCalledWith('events');
      expect(eventCollectionSpy.add).toHaveBeenCalledWith(component.event);
      expect(loaderSpy.dismiss).toHaveBeenCalled();
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('show');
    });

    it('should handle Firestore errors and show a toast', async () => {
      const loaderSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));

      angularFirestoreSpy.collection.and.throwError('Error');

      try {
        await component.createEvent(component.event);
      } catch (e) {
        expect(component.formValidation).toHaveBeenCalled();
        expect(loadingControllerSpy.create).toHaveBeenCalled();
        expect(loaderSpy.present).toHaveBeenCalled();
        expect(angularFirestoreSpy.collection).toHaveBeenCalledWith('events');
        expect(loaderSpy.dismiss).toHaveBeenCalled();
        expect(toastControllerSpy.create).toHaveBeenCalled();
        expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
      }
    });
  });
});
