import { Component, inject, OnInit, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { MediaApiService } from '../../core/api/media-api.service';
import { PostsApiService } from '../../core/api/posts-api.service';
import { Post } from '../../core/api/models/post.types';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';
import { FeedService } from './feed.service';
import { PostCard } from '../../shared/post-card/post-card';

// Interfaccia che descrive i campi del form di creazione post
interface CreatePostModel {
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [FormField, FormRoot, PostCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Iniezione delle dipendenze con inject()
  private readonly authService = inject(AuthService);
  private readonly feedService = inject(FeedService);
  private readonly postsApi = inject(PostsApiService);
  private readonly mediaApi = inject(MediaApiService);

  // Signal letti dal service del feed
  protected readonly currentUser = this.authService.currentUser;
  protected readonly feedPosts = this.feedService.posts;
  protected readonly isFeedLoading = this.feedService.isLoading;
  protected readonly feedError = this.feedService.error;
  protected readonly isFeedEmpty = this.feedService.isEmpty;

  // Signal locali per il form di creazione post
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly fileError = signal<string | null>(null);
  protected readonly uploading = signal(false);

  // Modello del form — solo il testo, l'immagine è gestita separatamente
  protected readonly postModel = signal<CreatePostModel>({
    text: '',
  });

  // Form con @angular/forms/signals, stesso pattern di login e register
  protected readonly postForm = form(
    this.postModel,
    (post) => {
      required(post.text, { message: 'Inserisci il testo del post.' });
      maxLength(post.text, 500, { message: 'Il testo non può superare i 500 caratteri.' });
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
            let imageUrl: string | null = null;
            const file = this.selectedImage();

            if (file) {
              // Prima si carica l'immagine e si ottiene la URL
              this.uploading.set(true);
              const uploaded = await firstValueFrom(this.mediaApi.uploadPostImage(file));
              imageUrl = uploaded.url;
            }

            // Poi si crea il post con il testo e la URL dell'immagine (se presente)
            await firstValueFrom(
              this.postsApi.create({
                text: this.postModel().text,
                imageUrl,
              }),
            );

            // Reset del form e del file dopo la pubblicazione
            this.postModel.set({ text: '' });
            this.selectedImage.set(null);

            // Ricarica il feed per mostrare il nuovo post
            this.feedService.loadFeed();
            return;
          } catch (error: unknown) {
            return {
              kind: 'serverError' as const,
              message: extractHttpErrorMessage(error, 'Pubblicazione del post non riuscita.'),
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

  // Al montaggio della pagina si carica subito il feed
  ngOnInit(): void {
    this.feedService.loadFeed();
  }

  // Ricarica il feed manualmente — chiamato dal bottone Aggiorna
  protected reloadFeed(): void {
    this.feedService.loadFeed();
  }

  // Gestisce la selezione dell'immagine — il file input non usa [formField]
  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedImage.set(null);
      this.fileError.set(null);
      return;
    }

    // Validazione del tipo file prima dell'upload
    if (!file.type.startsWith('image/')) {
      this.selectedImage.set(null);
      this.fileError.set('Seleziona un file immagine valido.');
      input.value = '';
      return;
    }

    this.selectedImage.set(file);
    this.fileError.set(null);
  }

  // Aggiorna il post nel feed dopo like o unlike
  protected onLikeToggled(updated: Post): void {
    this.feedService.updatePost(updated);
  }
}