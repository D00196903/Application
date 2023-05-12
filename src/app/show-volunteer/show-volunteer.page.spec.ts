import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import { ShowVolunteerPage } from './show-volunteer.page';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

describe('ShowVolunteerPage', () => {
  let component: ShowVolunteerPage;
  let fixture: ComponentFixture<ShowVolunteerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowVolunteerPage ],
      imports: [
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
        AngularFirestoreModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVolunteerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
