import { Routes } from '@angular/router';

import { authChildGuard, publicOnlyChildGuard } from './core/auth/auth.guard';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { ProtectedLayout } from './layouts/protected-layout/protected-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { PublicProfile } from './pages/public-profile/public-profile';
import { Search } from './pages/search/search';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    component: AuthLayout,
    canActivateChild: [publicOnlyChildGuard],
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
  {
    path: '',
    component: ProtectedLayout,
    canActivateChild: [authChildGuard],
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'profile/:id',
        component: PublicProfile,
      },
      {
        path: 'search',
        component: Search,
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
