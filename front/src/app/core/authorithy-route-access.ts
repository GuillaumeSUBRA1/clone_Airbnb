import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {map} from "rxjs";
import { AuthService } from "../services/auth.service";

export const authorityRouteAccess: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.fetchHttpUser(false).pipe(
    map(u => {
      if (u) {
        const auth = next.data['authorities'];
        return !auth || auth.length === 0 || authService.hasAuthority(auth);
      }
      authService.login();
      return false;
    })
  );
}
