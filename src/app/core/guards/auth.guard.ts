import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const loginTree = router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  // Case 1: no token at all → redirect immediately
  if (!auth.isAuthenticated()) {
    return loginTree;
  }

  // Case 2: token + user already loaded (normal in-app navigation)
  if (auth.currentUser()) {
    return true;
  }

  // Case 3: token exists but user not yet resolved (page refresh or stale token).
  // Fetch the user; if the server rejects the token, clear the session and redirect.
  return auth.fetchUser().pipe(
    map(() => true as const),
    catchError(() => {
      auth.clearSession();
      return of(loginTree);
    }),
  );
};
