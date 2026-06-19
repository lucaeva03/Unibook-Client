import { Component, inject, OnInit, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { UsersApiService } from '../../core/api/users-api.service';
import { MediaApiService } from '../../core/api/media-api.service';
import { PostsApiService } from '../../core/api/posts-api.service';
import { Post } from '../../core/api/models/post.types';
import { AuthService } from '../../core/auth/auth.service';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';
import { ProfileService } from './profile.service';
import { PostCard } from '../../shared/post-card/post-card';

// Interfaccia che descrive i campi del form di modifica profilo
interface EditProfileModel {
  bio: string;
}

@Component({
  selector: 'app-profile',
  imports: [FormField, FormRoot, PostCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  // Iniezione delle dipendenze con inject() — non si usa il costruttore
  private readonly profileService = inject(ProfileService);
  private readonly usersApi = inject(UsersApiService);
  private readonly mediaApi = inject(MediaApiService);
  private readonly postsApi = inject(PostsApiService);
  private readonly authService = inject(AuthService);

  // Il componente legge i signal dal service — non duplica la logica
  protected readonly user = this.profileService.user;
  protected readonly posts = this.profileService.posts;
  protected readonly isLoading = this.profileService.isLoading;
  protected readonly error = this.profileService.error;
  protected readonly isEmpty = this.profileService.isEmpty;
  protected readonly isPostsEmpty = this.profileService.isPostsEmpty;

  // Signal locali per gestire il file avatar separatamente dal form
  protected readonly selectedAvatar = signal<File | null>(null);
  protected readonly fileError = signal<string | null>(null);
  protected readonly uploading = signal(false);

  // Modello del form con il pattern signal — stesso approccio di login e register
  protected readonly model = signal<EditProfileModel>({
    bio: '',
  });

  // Form costruito con @angular/forms/signals, stesso pattern di login.ts e register.ts
  protected readonly form = form(
    this.model,
    () => {
      // Nessuna validazione obbligatoria: bio e avatar sono entrambi facoltativi
    },
    {
      submission: {
        action: async () => {
          // Se c'è un errore sul file non si procede
          if (this.fileError()) {
            return {
              kind: 'serverError' as const,
              message: this.fileError() ?? 'Seleziona un file valido.',
            };
          }

          try {
            // Si parte dall'avatar attuale, che verrà sostituito solo se c'è un nuovo file
            let avatarUrl: string | null = this.user()?.avatarUrl ?? null;
            const file = this.selectedAvatar();

            if (file) {
              // Prima si carica l'immagine sul backend e si ottiene l'URL
              this.uploading.set(true);
              const uploaded = await firstValueFrom(this.mediaApi.uploadAvatar(file));
              avatarUrl = uploaded.url;
            }

            // Poi si aggiorna il profilo con la URL ottenuta (o quella precedente)
            const updated = await firstValueFrom(
              this.usersApi.updateMe({
                bio: this.model().bio || null,
                avatarUrl,
              }),
            );

            // Si aggiorna il signal nel service con i nuovi dati
            this.profileService.refreshUser(updated);
            this.selectedAvatar.set(null);
            return;
          } catch (error: unknown) {
            return {
              kind: 'serverError' as const,
              message: extractHttpErrorMessage(error, 'Aggiornamento profilo non riuscito.'),
            };
          } finally {
            this.uploading.set(false);
          }
        },
        onInvalid: (field) => {
          field().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
      },
    },
  );

  // Al montaggio del componente si caricano subito i dati del profilo
  ngOnInit(): void {
    this.profileService.loadProfile();
  }

  // Gestisce la selezione del file avatar — il file input non usa [formField]
  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedAvatar.set(null);
      this.fileError.set(null);
      return;
    }

    // Validazione del tipo di file prima dell'upload
    if (!file.type.startsWith('image/')) {
      this.selectedAvatar.set(null);
      this.fileError.set('Seleziona un file immagine valido.');
      input.value = '';
      return;
    }

    this.selectedAvatar.set(file);
    this.fileError.set(null);
  }

  // Aggiorna il post nella lista dopo like o unlike
  protected onLikeToggled(updated: Post): void {
    this.profileService.updatePost(updated);
  }

  // Elimina un post: chiama l'API e aggiorna la lista locale
  protected async deletePost(postId: string): Promise<void> {
    try {
      await firstValueFrom(this.postsApi.remove(postId));
      this.profileService.removePost(postId);
    } catch {
      // Errore silenzioso — l'utente può riprovare
    }
  }
}