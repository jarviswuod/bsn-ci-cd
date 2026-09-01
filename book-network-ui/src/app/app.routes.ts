import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ActivateAccount } from './pages/activate-account/activate-account';
import { authGuard } from './services/guard/auth-guard';
import { guestGuard } from './services/guard/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: 'activate-account',
    component: ActivateAccount,
    canActivate: [guestGuard],
  },
  {
    path: 'books',
    loadChildren: () => import('./modules/book/book-module').then((m) => m.BookModule),
    canActivate: [authGuard],
  },
];
