import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let afAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    const loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);
    const afAuthSpyObj = jasmine.createSpyObj('AngularFireAuth', ['createUserWithEmailAndPassword']);
    const navCtrlSpyObj = jasmine.createSpyObj('NavController', ['navigateRoot']);

    await TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      providers: [
        { provide: ToastController, useValue: toastSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: AngularFireAuth, useValue: afAuthSpyObj },
        { provide: NavController, useValue: navCtrlSpyObj }
      ]
    }).compileComponents();

    toastCtrlSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    loadingCtrlSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    afAuthSpy = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
