import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';

import { ShowPage } from './show.page';
import { AngularFireModule } from '@angular/fire/compat';

describe('ShowPage', () => {
  let component: ShowPage;
  let fixture: ComponentFixture<ShowPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPage ],
      imports: [IonicModule.forRoot(), AngularFireModule.initializeApp(environment.FIREBASE_CONFIG)]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
