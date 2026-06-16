import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { UsersApiService } from '../../core/api/users-api.service';
import { Post } from '../../core/api/models/post.types';
import { UserPublic } from '../../core/api/models/user.types';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';

@Injectable({ providedIn: 'root' })
export class PublicProfileService {
  private readonly usersApi = inject(UsersApiService);

  // Signal privati per lo stato interno
  private readonly profileState = signal<UserPublic | null>(null);
  private readonly postsState = signal<Post[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  // Signal separato per il caricamento del follow/unfollow (il bottone si disabilita solo durante quell'operazione)
  private readonly followLoadingState = signal(false);

  // Signal pubblici in sola lettura
  readonly profile = this.profileState.asReadonly();
  readonly posts = this.postsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly followLoading = this.followLoadingState.asReadonly();

  // isEmpty è true se non sta caricando, non c'è errore e non ci sono dati profilo
  readonly isEmpty = computed(
    () => !this.isLoading() && this.error() === null && this.profile() === null,
  );

  // isPostsEmpty è true se il caricamento è finito e non ci sono post
  readonly isPostsEmpty = computed(
    () => !this.isLoading() && this.posts().length === 0,
  );

  // Carica il profilo pubblico e i post dell'utente tramite il suo id
  loadProfile(userId: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);
    // Resetta i dati precedenti prima di caricare quelli nuovi
    this.profileState.set(null);
    this.postsState.set([]);

    this.usersApi
      .getById(userId)
      .pipe(
        catchError((error: unknown) => {
          this.errorState.set(extractHttpErrorMessage(error, 'Impossibile caricare il profilo.'));
          return EMPTY;
        }),
        finalize(() => {
          this.loadingState.set(false);
        }),
      )
      .subscribe((profile) => {
        this.profileState.set(profile);
        // Dopo aver caricato il profilo, carica anche i suoi post
        this.loadPosts(userId);
      });
  }

  // Carica i post dell'utente
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

  // Segue l'utente e aggiorna lo stato localmente senza ricaricare il profilo
  async follow(userId: string): Promise<void> {
    this.followLoadingState.set(true);
    try {
      await firstValueFrom(this.usersApi.follow(userId));
      // Aggiorna isFollowing e il contatore follower direttamente nel signal
      this.profileState.update((p) =>
        p ? { ...p, isFollowing: true, followersCount: p.followersCount + 1 } : p,
      );
    } catch {
      // Errore silenzioso (lo stato rimane invariato)
    } finally {
      this.followLoadingState.set(false);
    }
  }

  // Smette di seguire l'utente e aggiorna lo stato localmente
  async unfollow(userId: string): Promise<void> {
    this.followLoadingState.set(true);
    try {
      await firstValueFrom(this.usersApi.unfollow(userId));
      // Aggiorna isFollowing e il contatore follower direttamente nel signal
      this.profileState.update((p) =>
        p ? { ...p, isFollowing: false, followersCount: p.followersCount - 1 } : p,
      );
    } catch {
      // Errore silenzioso
    } finally {
      this.followLoadingState.set(false);
    }
  }
}