import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AddPostPage } from './add-post.page';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

describe('AddPostPage', () => {
  let component: AddPostPage;
  let fixture: ComponentFixture<AddPostPage>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPostPage],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        ToastController,
        LoadingController,
        NavController,
        AngularFirestore,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostPage);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should handle the case where ActivatedRoute is not available', () => {
    // spy on ActivatedRoute and return an observable that throws an error
    const activatedRouteSpy = spyOn(activatedRoute, 'params').and.returnValue(throwError(new Error('Test error')));

    // call ngOnInit
    component.ngOnInit();

    // expect that the component sets the default post object and does not try to retrieve a post
    expect(component.post).toEqual({ title: '', content: '', author: '' });
    expect(activatedRouteSpy).toHaveBeenCalled();
  });

  it('should define present property', async () => {
    const toastElement = document.createElement('ion-toast');
    // create spies for ToastController and LoadingController methods
    const toastCtrlSpy = spyOn(TestBed.inject(ToastController), 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() }));
    const loadingCtrlSpy = spyOn(TestBed.inject(LoadingController), 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() }));

    // Call the method that creates the loading element
    component.showLoader();

    // Assert that loadingCtrl.create was called
    expect(loadingCtrlSpy).toHaveBeenCalled();

    // Get the instance of the loading element
    const loadingInstance = await loadingCtrlSpy.calls.mostRecent().returnValue;

    // Assert that the present method is defined
    expect(loadingInstance.present).toBeDefined();
  });

  it('should call form validation when creating event', () => {
    // spy on the form's validate method
    const validateSpy = spyOn(component.postForm, 'validate');
    component.postForm.controls['title'].setValue('family fun day');
    component.postForm.controls['details'].setValue('suitable for all ages');
    component.postForm.controls['location'].setValue('drogheda');

    // call createPost method
    component.createPost();

    // expect that the form's validate method was called
    expect(validateSpy).toHaveBeenCalled();
  });
});
