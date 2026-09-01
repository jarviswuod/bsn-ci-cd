import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Token } from '../token/token';

export const guestGuard: CanActivateFn = () => {
  const tokenService = inject(Token);
  const router = inject(Router);

  if (!tokenService.isTokenNotValid()) {
    router.navigate(['books']);
    return false;
  }
  return true;
};
