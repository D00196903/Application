import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';



import { environment } from 'src/environments/environment';
import { VolunteerPage } from '../volunteer/volunteer.page';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';



describe('VolunteerPage', () => {
  let component: VolunteerPage;
  let fixture: ComponentFixture<VolunteerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerPage ],
      imports: [
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
        AngularFirestoreModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VolunteerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
