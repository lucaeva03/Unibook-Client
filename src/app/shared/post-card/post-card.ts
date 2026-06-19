import { Component, inject, input, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PostsApiService } from '../../core/api/posts-api.service';
import { Post } from '../../core/api/models/post.types';
import { formatPostDate } from '../format-date';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  private readonly postsApi = inject(PostsApiService);

  // Input obbligatorio: il post da visualizzare
  post = input.required<Post>();

  // Input opzionale: se true mostra il bottone elimina (solo sui propri post)
  showDelete = input<boolean>(false);

  // Output: emette l'id del post quando si clicca elimina
  deleted = output<string>();

  // Output: emette il post aggiornato dopo like o unlike
  likeToggled = output<Post>();

  // Signal locale per disabilitare il bottone durante la chiamata API
  protected readonly likeLoading = signal(false);

  // Gestisce il toggle like/unlike sul post
  protected async onToggleLike(): Promise<void> {
    if (this.likeLoading()) return;

    this.likeLoading.set(true);
    try {
      const p = this.post();

      if (p.isLiked) {
        // Se già piaciuto, toglie il like
        await firstValueFrom(this.postsApi.unlike(p.id));
        this.likeToggled.emit({ ...p, isLiked: false, likesCount: p.likesCount - 1 });
      } else {
        // Se non ancora piaciuto, aggiungi il like
        await firstValueFrom(this.postsApi.like(p.id));
        this.likeToggled.emit({ ...p, isLiked: true, likesCount: p.likesCount + 1 });
      }
    } catch {
      // Errore silenzioso, lo stato del post rimane invariato
    } finally {
      this.likeLoading.set(false);
    }
  }

  // Emette l'id del post verso il componente padre che gestirà l'eliminazione
  protected onDelete(): void {
    this.deleted.emit(this.post().id);
  }

  // Espone la data formattata al template
  protected formattedDate(): string {
    return formatPostDate(this.post().createdAt);
  }
}