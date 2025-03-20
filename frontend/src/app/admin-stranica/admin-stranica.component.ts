import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { StatusNaloga } from '../utils/status_naloga';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { TipKorisnika } from '../utils/tipoviKorisnika';

@Component({
  selector: 'app-admin-stranica',
  templateUrl: './admin-stranica.component.html',
  styleUrls: ['./admin-stranica.component.css']
})
export class AdminStranicaComponent implements OnInit {


  ngOnInit(): void {

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.userServis.dohvatiSveKorisnike().subscribe((korisnici: Korisnik[])=>{
      this.korisnici = korisnici;
      this.firmaServis.dohvSveFirme().subscribe((firme: Firma[])=>{
        this.firme = firme;
      })
      this.izabranaSekcija='vlasnici';
    })
  }

  constructor(private ruter: Router, private userServis : UserService, private firmaServis : FirmaService) { }

  ulogovan : Korisnik = new Korisnik();
  izabranaSekcija : string = ""
  slikaUrl = "http://localhost:4000/uploads/";
  korisnici : Korisnik[] = []
  firme : Firma[] = [];

  dohvPristigleZahteve(): Korisnik[] {
    return this.korisnici.filter(k=>k.status_naloga==StatusNaloga.Kreiran);
  }

  dohvVlasnike(): Korisnik[]{
    return this.korisnici.filter(k=>
      k.status_naloga!=StatusNaloga.Kreiran &&
      k.status_naloga != StatusNaloga.Odbijen && k.tip==TipKorisnika.Vlasnik);
  }

  //sortriani po idiju firme
  dohvDekoratere(){
    return this.korisnici.filter(k=>
      k.status_naloga!=StatusNaloga.Kreiran &&
      k.status_naloga!=StatusNaloga.Odbijen && k.tip==TipKorisnika.Dekorater)
      .sort((a : Korisnik, b: Korisnik)=>{
        if(a.id_firme > b.id_firme) return -1;
        if(a.id_firme < b.id_firme) return 1;
        return 0;
      });
  }

  donjiCeoDeo(realanBroj: number){
    return Math.floor(realanBroj);
  }

  odobriNalog(k : Korisnik){
    this.promeniStatusNaloga(k, StatusNaloga.Potvrdjen);
  }

  odbijNalog(k : Korisnik){
    this.promeniStatusNaloga(k, StatusNaloga.Odbijen);
  }

  deaktivirajNalog(k : Korisnik){
    this.promeniStatusNaloga(k, StatusNaloga.Deaktiviran);
  }

  reaktivirajNalog(k:Korisnik){
    this.promeniStatusNaloga(k, StatusNaloga.Potvrdjen);
  }

  odblokirajNalog(k : Korisnik){
    this.promeniStatusNaloga(k, StatusNaloga.Potvrdjen);
  }

  promeniStatusNaloga(k : Korisnik, novi_status : string){
    this.userServis.azuirajPodatke(k.kor_ime, 'status_naloga', novi_status).subscribe((resp:any)=>{
      if(resp['msg']){
        console.log(resp['msg']);
      }
      k.status_naloga = novi_status;
    })
  }

  izmeniProfil(k : Korisnik){
    localStorage.setItem("korisnik", JSON.stringify(k));
    this.ruter.navigate(["/admin-izmena-profila"]);
  }

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login-admin']);
  }

  dohvNazivFirme(id: number){
    return this.firme.filter(f=>f.id == id)[0].naziv;
  }

}
