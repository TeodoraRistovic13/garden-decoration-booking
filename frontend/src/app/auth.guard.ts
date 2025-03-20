import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  // const router = inject(Router);

  // // Dohvati korisnika iz localStorage
  // const user = localStorage.getItem("ulogovan");

  // if (user === null) {
  //   // Korisnik nije ulogovan
  //   router.navigate(['/login']);
  //   return false;
  // } else {
  //   const ulogovan = JSON.parse(user);
  //   // Proveri da li je uloga korisnika odgovara očekivanoj
  //   if (route.data['expectedRole'] && ulogovan.tip === route.data['expectedRole']) {
  //     return true;
  //   } else {
  //     router.navigate(['/neautorizovan-pristup']);
  //     return false;
  //   }
  // }

  const router = inject(Router);
  // Dohvati korisnika iz localStorage
  const user = localStorage.getItem("ulogovan");

  if (user === null) {
    // Korisnik nije ulogovan
    alert("Morate prvo da se ulogujete!")
    router.navigate(['/login']);
    return false;
  } else {
    const ulogovan = JSON.parse(user);
    // Proveri da li je uloga korisnika odgovara očekivanoj
    let rolesString : string[] = route.data['expectedRole'].split(',');

    if (route.data['expectedRole'] && rolesString.filter(r=>ulogovan.tip==r).length!=0) {
      return true;
    } else {
      router.navigate(['/neautorizovan-pristup']);
      return false;
    }
  }
};
