import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticeboardPage } from './noticeboard.page';

describe('NoticeboardPage', () => {
  let component: NoticeboardPage;
  let fixture: ComponentFixture<NoticeboardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoticeboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
