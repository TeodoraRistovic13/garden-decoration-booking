import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Korisnik } from '../models/user';
import { TipKorisnika } from '../utils/tipoviKorisnika';
import { Zakazivanje } from '../models/zakazivanje';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit{

  ngOnInit(): void {

    this.userServis.dohvUkBrojKorisnika("vlasnik").subscribe((broj: number)=>{
      this.uk_broj_vlasnika = broj;
    })
    this.userServis.dohvUkBrojKorisnika("dekorater").subscribe((broj: number)=>{
      this.uk_broj_dekoratera = broj;
    })

    this.userServis.dohvatiSveKorisnike().subscribe(korisnici=>{
      if (korisnici!= null && korisnici.length!=0){
        this.zaposleniDekorateri = korisnici.filter(k=>k.tip==TipKorisnika.Dekorater&&k.id_firme!=-1);
        console.log(this.zaposleniDekorateri)
      }
    })

    this.firmaServis.dohvSveFirme().subscribe((firme: Firma[])=>{
      if(firme != null){
        this.firme = firme;
      }else{
        console.log("Nema firmi")
      }
    })

    this.filterAktivan = false;

    this.zakazivanjeServis.dohvUkupanBrDekorisanihBasta().subscribe((broj:number)=>{
      this.uk_broj_dekorisanih_basta = broj;
    })

    this.zakazivanjeServis.dohvBrojNovihPoslovaUVremenu().subscribe((info:any)=>{

      if(info!=null){

        this.broj24Sata = info[0].Broj24Sata;
        this.broj7Dana = info[0].Broj7Dana;
        this.broj30Dana = info[0].Broj30Dana;

      }

    })

    this.zakazivanjeServis.dohvZavrsenaZakazivanja().subscribe((zakazivanje: Zakazivanje[])=>{
      this.zakazivanjaSlike = zakazivanje.filter(z=>z.slika !='').sort((a : Zakazivanje,b: Zakazivanje)=>{
        if(a.datum_zavrsetka > b.datum_zavrsetka) return -1;
        if(a.datum_zavrsetka < b.datum_zavrsetka) return 1;
        return 0;
      });
      let x = this.zakazivanjaSlike.length > 15 ? 15 : this.zakazivanjaSlike.length;

      this.zakazivanjaSlike = this.zakazivanjaSlike.splice(0, x);
    })
  }

  constructor (private userServis: UserService, private firmaServis : FirmaService, private zakazivanjeServis: ZakazivanjeService) { }

  pretragaIme = "";
  pretragaAdresa = "";
  pretragaTip = "";
  firme : Firma[] = [];
  filtriraneFirme : Firma[] = [];
  zaposleniDekorateri : Korisnik [] = [];

  uk_broj_dekorisanih_basta : number = 0;
  uk_broj_vlasnika : number = 0;
  uk_broj_dekoratera : number = 0;

  broj24Sata : number = 0;
  broj7Dana : number = 0;
  broj30Dana : number = 0;

  slikaUrl = "http://localhost:4000/uploads/";
  zakazivanjaSlike : Zakazivanje[] = []
  filterAktivan: boolean = false;

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

      if (!this.pretragaIme && !this.pretragaAdresa && !this.pretragaTip) {
        return true;
      }
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

  ponistiFiltere(){
    this.filterAktivan = false;
  }

  dohvDekoratereZaFirmu(id_firme:number){
    return this.zaposleniDekorateri.filter(d=>d.id_firme==id_firme);
  }


}
