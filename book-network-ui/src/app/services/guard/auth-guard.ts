import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Token } from '../token/token';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(Token);
  const router = inject(Router);

  if (tokenService.isTokenNotValid()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
