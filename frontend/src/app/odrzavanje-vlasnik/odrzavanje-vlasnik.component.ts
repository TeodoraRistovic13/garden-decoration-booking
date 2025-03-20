import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Zakazivanje } from '../models/zakazivanje';
import { FirmaService } from '../services/firma.service';
import { Korisnik } from '../models/user';
import { StatusZakazivanja } from '../utils/status_zakazivanja';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-odrzavanje-vlasnik',
  templateUrl: './odrzavanje-vlasnik.component.html',
  styleUrls: ['./odrzavanje-vlasnik.component.css']
})
export class OdrzavanjeVlasnikComponent implements OnInit {

  ngOnInit(): void {

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.firmaServis.dohvZakazivanjaZaKorisnika(this.ulogovan.kor_ime).subscribe(niz=>{
      this.poslovi = niz;
      let naServisiranju = this.poslovi.filter(p=>p.status==StatusZakazivanja.Servisiranje);
      naServisiranju.forEach(p=>{
        let datum = new Date(p.datum_odrzavanja);
        let sada = new Date();
        if(datum <= sada){
          this.zakazivanjeServis.promeniStatusZakazivanja(p, StatusZakazivanja.Zavrseno).subscribe((resp:any)=>{
            if(resp['message']){
              console.log(resp['message'])
            }
            p.status=StatusZakazivanja.Zavrseno;
          })
        }
      })
    })
  }

  constructor(private ruter: Router, private firmaServis : FirmaService, private zakazivanjeServis: ZakazivanjeService,private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  poslovi : Zakazivanje[] = []
  zavrseniPoslovi : Zakazivanje [] = [];
  ulogovan : Korisnik = new Korisnik();

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);
  }

  potrebnoServisiranje(z: Zakazivanje) : boolean {

    const sada = new Date();
    //proslo je 6 meseci od zavrsetka radova
    if(z.odrzavanoBarJednom == false){

      const datumZavrseno = new Date(z.datum_zavrsetka);
      let yearDifference = sada.getFullYear() - datumZavrseno.getFullYear();
      let monthDifference = sada.getMonth() - datumZavrseno.getMonth();
      return yearDifference * 12 + monthDifference > 6;
      //return true;

    }else{
      //proslo je 6 meseci od posl odrzavanja
      const datPoslOdrz = new Date(z.datum_odrzavanja);
      let yearDifference = sada.getFullYear() - datPoslOdrz.getFullYear();
      let monthDifference = sada.getMonth() - datPoslOdrz.getMonth();

      //ovo je uslov za 6 meseci radi tesitranja koristimo manji uslov
      return yearDifference * 12 + monthDifference > 6;
    }
  }

  dohvZavrsenePoslove() : Zakazivanje[] {
    return this.zavrseniPoslovi = this.poslovi.filter(z=> z.status == StatusZakazivanja.Zavrseno);
  }

  dohvNaServisiranju() : Zakazivanje[]{
    return this.zavrseniPoslovi = this.poslovi.filter(z=> z.status == StatusZakazivanja.Servisiranje || z.status == StatusZakazivanja.CekaMajstora);
  }

  //poslati zahtev za servisiranje
  servisiraj(z: Zakazivanje){

    this.zakazivanjeServis.promeniStatusZakazivanja(z, StatusZakazivanja.CekaMajstora).subscribe((resp:any)=>{
      if(resp['message']){
        this.openSnackBar('Uspesno poslat zahtev za servisiranje!');
      }
      z.status = StatusZakazivanja.CekaMajstora;
    })
  }
}
