import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firma } from '../models/firma';
import { Zakazivanje } from '../models/zakazivanje';
import { Recenzija } from '../models/recenzija';
import { Korisnik } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/firme"


  dohvSveFirme(){
    return this.http.get<Firma[]>(`${this.uri}/getAllCompanies`);
  }


  dohvZakazivanjaZaFirmu(naziv_firme : String){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getJobsForCompany?firma=${naziv_firme}`);
  }

  dohvSveZahteveZaOdrzavanjeZaFirmu(firma_naziv: string){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getMaintenanceRequestsForCompany?firma=${firma_naziv}`);
  }


  dohvSvaOdrzavanjaZaDekoratera(kor_ime_dekoratera: string){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getMaintenanceRequestsForDecorater?kor_ime=${kor_ime_dekoratera}`);
  }


  dodajZakazivanje(z : Zakazivanje){

    const data = {
      zakazivanje : z
    }

    return this.http.post(`${this.uri}/addNewJobRequest`, data);
  }


  dohvZakazivanjaZaKorisnika(kor_ime: string) {

    return this.http.get<Zakazivanje[]>(`${this.uri}/getJobRequestsForUser?kor_ime=${kor_ime}`);

  }

  azurirajProsecnuOcenuFirme(firma_naziv: string){

    return this.http.get(`${this.uri}/updateCurrentRatingForCompany?firma_naziv=${firma_naziv}`);
  }

  dodajFirmu(f : Firma){

    const data = {
      firma : f
    }

    return this.http.post(`${this.uri}/addNewCompany`, data);

  }

  dohvFirmuPoIdiju(id : number){
    return this.http.get<Firma>(`${this.uri}/getCompanyById?id=${id}`);
  }

  dohvDekoratereZaFirmu(id: number){
    return this.http.get<Korisnik[]>(`${this.uri}/getDecoratorsInCompany?id=${id}`);
  }

  dohvSlobodneDekoratere(id_firme: number, datum: Date){

    const data = {
      id : id_firme,
      datum : datum
    }

    return this.http.post<any>(`${this.uri}/getFreeDecorators`, data);

  }







}
