import { TipKorisnika } from './../utils/tipoviKorisnika';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FirmaService } from './../services/firma.service';
import { Component, OnInit } from '@angular/core';
import { Firma } from '../models/firma';
import { Korisnik } from '../models/user';

@Component({
  selector: 'app-firme-vlasnik',
  templateUrl: './firme-vlasnik.component.html',
  styleUrls: ['./firme-vlasnik.component.css']
})
export class FirmeVlasnikComponent implements OnInit{

  ngOnInit(): void {
    this.firmaServis.dohvSveFirme().subscribe((firme: Firma[])=>{
      if(firme != null){
        this.firme = firme;
        this.userServis.dohvatiSveKorisnike().subscribe(korisnici=>{
          if (korisnici!= null && korisnici.length!=0){
            this.zaposleniDekorateri = korisnici.filter(k=>k.tip==TipKorisnika.Dekorater&&k.id_firme!=-1);
            console.log(this.zaposleniDekorateri)
          }
        })
      }else{
        console.log("Nema firmi")
      }
    })
  }

  constructor(private firmaServis: FirmaService, private userServis: UserService, private ruter: Router) {}

  firme: Firma[] = [];
  filtriraneFirme: Firma[] = [];
  pretragaIme: string ="";
  pretragaAdresa: string ="";
  filterAktivan: boolean = false;
  zaposleniDekorateri : Korisnik [] = [];

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']); //mozemo da se vratimo i na login..al neka ga ovako za sada
  }

  sortirajFirme (kolona: string, poredakSortiranja: string, firme: Firma[]){
    firme.sort((a: any, b: any)=>{
      let comparison = 0;
      if(a[kolona] > b[kolona]){
        comparison = 1;
      }else if (a[kolona] < b[kolona]){
        comparison = -1;
      }
      return poredakSortiranja == 'asc'? comparison: -comparison;
    })
  }

  pretraziFirme() {
    this.filtriraneFirme = this.firme.filter(firma => {
      if (!this.pretragaIme && !this.pretragaAdresa) {
        return true;
      }
      // Regex za pretragu po nazivu restorana
      //i oznacava da je pretraga case insensitive
      let regexExpr = new RegExp(this.escapeRegExp(this.pretragaIme), 'i');

      // Provera za naziv restorana (ukoliko je uneto)
      if (this.pretragaIme && !regexExpr.test(firma.naziv)) {
        return false; // Ako naziv ne odgovara, preskoci restoran
      }
      // Provera za adresu restorana (ukoliko je uneto)
      regexExpr = new RegExp(this.escapeRegExp(this.pretragaAdresa), 'i');
      if (this.pretragaAdresa && !regexExpr.test(firma.adresa)) {
        return false; // Ako adresa ne odgovara, preskoci restoran
      }
      return true; // Restoran odgovara svim kriterijumima pretraget
    });
    this.filterAktivan = true;
  }

  escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  ponistiFiltere() {
    this.filterAktivan = false;
  }

  donjiCeoDeo(realanBroj: number){
    return Math.floor(realanBroj);
  }

  detaljiFirme(f: Firma){
    localStorage.setItem("firma", JSON.stringify(f))
    this.ruter.navigate(['/firma-detalji'])
  }

  dohvDekoratereZaFirmu(id_firme:number){
    return this.zaposleniDekorateri.filter(d=>d.id_firme==id_firme);
  }

}
