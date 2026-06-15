import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnDestroy {
  private readonly searchService = inject(SearchService);

  // Signal letti dal service e esposti al template
  protected readonly results = this.searchService.results;
  protected readonly isLoading = this.searchService.isLoading;
  protected readonly error = this.searchService.error;
  protected readonly isEmpty = this.searchService.isEmpty;
  protected readonly hasSearched = this.searchService.hasSearched;

  // Signal locale per il valore dell'input di ricerca
  protected readonly query = signal('');

  // Aggiorna il signal query quando l'utente scrive nell'input
  protected onQueryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  // Avvia la ricerca — chiamato al click del bottone o alla pressione di Enter
  protected onSearch(): void {
    this.searchService.search(this.query());
  }

  // Quando si lascia la pagina si resetta lo stato per non mostrare risultati vecchi al ritorno
  ngOnDestroy(): void {
    this.searchService.reset();
  }
}