import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AddPostPage } from './add-post.page';
import { ActivatedRoute } from '@angular/router';

describe('AddPostPage', () => {
  let component: AddPostPage;
  let fixture: ComponentFixture<AddPostPage>;
  let activatedRouteSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPostPage],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostPage);
    component = fixture.componentInstance;
    // access the private router property using [] notation
    component['route'] = jasmine.createSpyObj('Router', ['navigate']);
    // create the spy for ActivatedRoute params and assign it to the variable
    activatedRouteSpy = spyOn(TestBed.inject(ActivatedRoute), 'params').and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should handle the case where ActivatedRoute is not available', () => {
    // spy on ActivatedRoute and return an observable that throws an error
    activatedRouteSpy = spyOn(TestBed.inject(ActivatedRoute), 'params').and.returnValue(of({} as Observable<never>));

    // call ngOnInit
    component.ngOnInit();

    // expect that the component sets the default post object and does not try to retrieve a post
    expect(component.post).toEqual({ title: '', content: '', author: '' });
    expect(activatedRouteSpy).toHaveBeenCalled();
  });

  it('should define present property', async () => {
    const toastElement = document.createElement('ion-toast');
    // create spies for ToastController and LoadingController methods
    const toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    const loadingCtrlSpy = jasmine.createSpyObj('LoadingController', ['create']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElement));
    loadingCtrlSpy.create.and.returnValue(Promise.resolve({ present: () => Promise.resolve() }));

    // Instantiate component and trigger change detection
    fixture = TestBed.createComponent(AddPostPage);
    component = fixture.componentInstance;
    // set the spies for ToastController and LoadingController methods
    component['toastCtrl'] = toastCtrlSpy;
    component['loadingCtrl'] = loadingCtrlSpy;
    fixture.detectChanges();

    // Call the method that creates the loading element
    component.showLoader();

    // Assert that loadingCtrl.create was called
    expect(loadingCtrlSpy.create).toHaveBeenCalled();

    // Get the instance of the loading element
    const loadingInstance = await loadingCtrlSpy.create.calls.mostRecent().returnValue;

    // Assert that the present method is defined
    expect(loadingInstance.present).toBeDefined();
  });

  it('should call form validation when creating event', () => {
    // spy on the form's validate method
    const validateSpy = spyOn(component.postForm, 'validate');
    component.postForm.controls['title'].setValue('Test Title');
    component.postForm.controls['content'].setValue('Test Content');
    component.postForm.controls['author'].setValue('Test Author');

    // call createPost method
    component.createPost();

    // expect that the form's validate method was called
    expect(validateSpy).toHaveBeenCalled();
  });
});
