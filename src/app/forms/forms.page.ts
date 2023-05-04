import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../services/quotes.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage {
  quote: any;

  constructor(private quotesService: QuotesService) {
    this.fetchQuote();
  }

  fetchQuote() {
    this.quotesService.getRandomQuote().subscribe(quote => {
      this.quote = quote;
    });
  }
}
