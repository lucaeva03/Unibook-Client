import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UsersApiService } from '../../core/api/users-api.service';
import { Post } from '../../core/api/models/post.types';
import { UserPrivate } from '../../core/api/models/user.types';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly usersApi = inject(UsersApiService);

  // Signal privati: contengono lo stato interno del service
  private readonly userState = signal<UserPrivate | null>(null);
  private readonly postsState = signal<Post[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  // Signal pubblici in sola lettura: il componente li legge ma non li modifica direttamente
  readonly user = this.userState.asReadonly();
  readonly posts = this.postsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // isEmpty è derivato con computed: è true solo se non sta caricando, non c'è errore e non ci sono dati
  readonly isEmpty = computed(
    () => !this.isLoading() && this.error() === null && this.user() === null,
  );

  // isPostsEmpty è derivato allo stesso modo ma per la lista post
  readonly isPostsEmpty = computed(
    () => !this.isLoading() && this.posts().length === 0,
  );

  // Carica i dati del profilo dell'utente autenticato
  loadProfile(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.usersApi
      .getMe()
      .pipe(
        // Se la richiesta fallisce, salva il messaggio di errore e interrompe lo stream
        catchError((error: unknown) => {
          this.errorState.set(extractHttpErrorMessage(error, 'Impossibile caricare il profilo.'));
          return EMPTY;
        }),
        // finalize viene eseguito sempre, sia in caso di successo che di errore
        finalize(() => {
          this.loadingState.set(false);
        }),
      )
      .subscribe((user) => {
        this.userState.set(user);
        // Dopo aver caricato il profilo, carica anche i post dell'utente
        this.loadPosts(user.id);
      });
  }

  // Carica i post dell'utente tramite il suo id
  private loadPosts(userId: string): void {
    this.usersApi
      .getPosts(userId)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe((posts) => {
        this.postsState.set(posts);
      });
  }

  // Aggiorna i dati utente nel signal dopo una modifica del profilo
  refreshUser(user: UserPrivate): void {
    this.userState.set(user);
  }

  // Rimuove un post dalla lista locale senza ricaricare tutto dal backend
  removePost(postId: string): void {
    this.postsState.update((posts) => posts.filter((p) => p.id !== postId));
  }

  // Aggiorna un singolo post nella lista dopo like o unlike
  updatePost(updated: Post): void {
    this.postsState.update((posts) =>
      posts.map((p) => (p.id === updated.id ? updated : p)),
    );
  }
}