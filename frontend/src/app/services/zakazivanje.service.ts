import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zakazivanje } from '../models/zakazivanje';
import { Recenzija } from '../models/recenzija';

@Injectable({
  providedIn: 'root'
})
export class ZakazivanjeService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/zakazivanje"

  dodajRecenziju(id_zakazivanja: number, recenzija: Recenzija){

    const data = {
      id: id_zakazivanja,
      recenzija : recenzija
    }
    return this.http.post(`${this.uri}/addCommentAndStars`, data);
  }

  dodajKomentarKodOdbijenogPosla(id : number, komentar: string){

    const data = {
      id : id,
      komentar : komentar
    }

    return this.http.post(`${this.uri}/addRejectComment`, data);

  }

  promeniStatusZakazivanja(z: Zakazivanje, status: string){
    return this.http.get(`${this.uri}/changeJobStatus?id=${z.id}&status=${status}`);

  }

  dohvBrojPoslovaPoMesecimaZaDekoratera(kor_ime_dekoratera: string){
    return this.http.get<any[]>(`${this.uri}/getJobsByMonthStatForDecorator?kor_ime=${kor_ime_dekoratera}`);
  }

  dohvProsecanBrPoslovimaPoDanimaUPoslDveGodine(){
    return this.http.get<any[]>(`${this.uri}/getAverageJobsByDayOfWeekInTwoYears`);
  }

  dohvRasporeduPoslaUFirmi(naziv_firme : string){

    return this.http.get<any[]>(`${this.uri}/getJobsDistributionInCompany?naziv_firme=${naziv_firme}`);
  }

  // postaviDekoratera(p: Zakazivanje, kor_ime: string){
  //   return this.http.get(`${this.uri}/acceptJobRequest?id=${p.id}&kor_ime=${kor_ime}`);
  // }

  postaviSliku(p: Zakazivanje, slika: string){
    return this.http.get(`${this.uri}/setPhoto?id=${p.id}&photo=${slika}`);
  }

  prihvatiOdrzavanje(z: Zakazivanje){

    const data = {
      posao: z
    }

    return this.http.post(`${this.uri}/acceptMaintenanceRequest`, data);
  }

  prihvatiZakazivanje(z: Zakazivanje){

    const data = {
      posao: z
    }

    return this.http.post(`${this.uri}/acceptJobRequest`, data);
  }

  zavrsiZakazivanje(z: Zakazivanje){

    const data = {
      posao : z
    }

    return this.http.post(`${this.uri}/finishRequest`, data);

  }

  dohvUkupanBrDekorisanihBasta(){

    return this.http.get<number>(`${this.uri}/getNumberOfFinishedJobs`);

  }

  dohvBrojNovihPoslovaUVremenu(){
    return this.http.get<any>(`${this.uri}/getNumberOfNewJobsInTime`);

  }

  dohvSvaZakazivanja(){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getAllJobs`);
  }

  dohvZavrsenaZakazivanja(){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getAllFinishedJobs`);
  }

}
