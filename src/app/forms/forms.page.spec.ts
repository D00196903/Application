import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsPage } from './forms.page';
import { QuotesService } from '../services/quotes.service';

describe('FormsPage', () => {
  let component: FormsPage;
  let fixture: ComponentFixture<FormsPage>;
  let quotesService: jasmine.SpyObj<QuotesService>;

  beforeEach(waitForAsync(() => {
    const quotesServiceSpy = jasmine.createSpyObj('QuotesService', ['getRandomQuote']);

    TestBed.configureTestingModule({
      declarations: [FormsPage],
      providers: [
        { provide: QuotesService, useValue: quotesServiceSpy }
      ]
    }).compileComponents();

    quotesService = TestBed.inject(QuotesService) as jasmine.SpyObj<QuotesService>;
    fixture = TestBed.createComponent(FormsPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a quote on creation', () => {
    const expectedQuote = { id: 1, content: 'Just one small positive thought in the morning can change your whole day.' };
    quotesService.getRandomQuote.and.returnValue(of(expectedQuote));

    fixture.detectChanges();

    expect(quotesService.getRandomQuote).toHaveBeenCalled();
    expect(component.quote).toEqual(expectedQuote);
  });
});
