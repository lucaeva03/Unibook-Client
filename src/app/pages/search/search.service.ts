import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UsersApiService } from '../../core/api/users-api.service';
import { UserSearchResult } from '../../core/api/models/user.types';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly usersApi = inject(UsersApiService);

  // Signal privati per lo stato interno
  private readonly resultsState = signal<UserSearchResult[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  // Signal aggiuntivo per sapere se l'utente ha già eseguito almeno una ricerca
  // Distinzione dello stato iniziale (non ha ancora cercato) dall'empty (ha cercato ma non ha trovato nulla)
  private readonly hasSearchedState = signal(false);

  // Signal pubblici in sola lettura
  readonly results = this.resultsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly hasSearched = this.hasSearchedState.asReadonly();

  // isEmpty è true solo se ha già cercato, non sta caricando, non c'è errore e non ci sono risultati
  readonly isEmpty = computed(
    () =>
      this.hasSearched() &&
      !this.isLoading() &&
      this.error() === null &&
      this.results().length === 0,
  );

  // Esegue la ricerca utenti per nome o cognome
  search(query: string): void {
    // Se la query è vuota non si fa nulla
    if (!query.trim()) return;

    this.loadingState.set(true);
    this.errorState.set(null);
    this.hasSearchedState.set(true);

    this.usersApi
      .search(query.trim())
      .pipe(
        catchError((error: unknown) => {
          this.errorState.set(extractHttpErrorMessage(error, 'Ricerca non riuscita.'));
          return EMPTY;
        }),
        finalize(() => {
          this.loadingState.set(false);
        }),
      )
      .subscribe((results) => {
        this.resultsState.set(results);
      });
  }

  // Resetta lo stato quando si lascia la pagina
  reset(): void {
    this.resultsState.set([]);
    this.errorState.set(null);
    this.hasSearchedState.set(false);
  }
}