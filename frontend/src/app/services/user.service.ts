import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/users"

  dodajKorisnika(k : Korisnik){

    const data = {
      korisnik : k
    }

    return this.http.post(`${this.uri}/register`, data);

  }

  // sacuvajSliku(formData : FormData){

  //   return this.http.post('http://localhost:4000/dodajSliku', formData, {
  //     reportProgress: true,
  //     observe : 'events'
  //   });
  // }

  posaljiZahtevZaValidacijuRecaptcha(captchaResponse : string ) {

    const data = {
      token : captchaResponse
    }

    return this.http.post(`${this.uri}/verify-recaptcha`, data);
  }

  sacuvajSliku(formData : FormData){

    return this.http.post(`${this.uri}/addPhoto`, formData, {
      reportProgress: true,
      observe : 'events'
    });
  }

  prijavaNaSistem(kor_ime:string, lozinka: string){

    const data = {
      kor_ime:kor_ime,
      lozinka:lozinka
    }

    return this.http.post<any>(`${this.uri}/login`, data);
  }

  azuirajPodatke(korIme: string, kojiPodatak: string, novPodatak: string){

    const data = {
      korIme: korIme,
      vrstaPodatka: kojiPodatak,
      novaVrednost: novPodatak
    }

    return this.http.post(`${this.uri}/updateUserData`, data);

  }

  promeniLozinku(kor_ime: string, nova_lozinka: string){

    const data = {
      kor_ime: kor_ime,
      nova_lozinka: nova_lozinka
    }

    return this.http.post(`${this.uri}/updatePassword`, data)

  }

  dohvKorisnikaPoImejlAdresi(imejl: string){

    return this.http.get(`${this.uri}/getUserByEmail?email=${imejl}`);

  }

  dohvatiSveKorisnike(){
    return this.http.get<Korisnik[]>(`${this.uri}/getAllUsers`);
  }

  dohvUkBrojKorisnika(tip: string){
    //tip je planirano da bude vlasnik ili dekorater...
    return this.http.get<number>(`${this.uri}/getNumberOfUsersByType?tip=${tip}`);
  }

  dodajFirmuZaDekoratera(kor_ime_dekoratera : string, id_firme : number){
    return this.http.get(`${this.uri}/addDecoratorToCompany?id_firme=${id_firme}&kor_ime=${kor_ime_dekoratera}`);
  }

  dohvKorisnika(kor_ime: string){
    return this.http.get(`${this.uri}/getUserByUsername?kor_ime=${kor_ime}`);
  }

}
