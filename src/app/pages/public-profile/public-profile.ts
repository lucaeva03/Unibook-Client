import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { PublicProfileService } from './public-profile.service';

@Component({
  selector: 'app-public-profile',
  imports: [],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
})
export class PublicProfile implements OnInit {
  private readonly publicProfileService = inject(PublicProfileService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Signal letti dal service e esposti al template
  protected readonly profile = this.publicProfileService.profile;
  protected readonly posts = this.publicProfileService.posts;
  protected readonly isLoading = this.publicProfileService.isLoading;
  protected readonly error = this.publicProfileService.error;
  protected readonly isEmpty = this.publicProfileService.isEmpty;
  protected readonly isPostsEmpty = this.publicProfileService.isPostsEmpty;
  protected readonly followLoading = this.publicProfileService.followLoading;

  // Id dell'utente di cui si sta visualizzando il profilo
  private userId = '';

  ngOnInit(): void {
    // Legge l'id dall'URL ( es. /profile/u_abc123)
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      // Se non c'è id nell'URL torna alla home
      this.router.navigateByUrl('/home');
      return;
    }

    // Se l'id corrisponde all'utente loggato reindirizza al proprio profilo
    const currentUserId = this.authService.currentUser()?.id;
    if (id === currentUserId) {
      this.router.navigateByUrl('/profile');
      return;
    }

    this.userId = id;
    this.publicProfileService.loadProfile(id);
  }

  // Chiama il service per seguire l'utente
  protected async onFollow(): Promise<void> {
    await this.publicProfileService.follow(this.userId);
  }

  // Chiama il service per smettere di seguire l'utente
  protected async onUnfollow(): Promise<void> {
    await this.publicProfileService.unfollow(this.userId);
  }
}