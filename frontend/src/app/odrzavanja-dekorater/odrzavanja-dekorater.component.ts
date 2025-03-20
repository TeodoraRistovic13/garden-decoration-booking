import { FirmaService } from './../services/firma.service';
import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';
import { Router } from '@angular/router';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Zakazivanje } from '../models/zakazivanje';
import { Firma } from '../models/firma';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusZakazivanja } from '../utils/status_zakazivanja';

@Component({
  selector: 'app-odrzavanja-dekorater',
  templateUrl: './odrzavanja-dekorater.component.html',
  styleUrls: ['./odrzavanja-dekorater.component.css']
})
export class OdrzavanjaDekoraterComponent implements OnInit {

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.firmaServis.dohvFirmuPoIdiju(this.ulogovan.id_firme).subscribe((firma : Firma)=>{

      if(firma != null){
        this.firmaServis.dohvSveZahteveZaOdrzavanjeZaFirmu(firma.naziv).subscribe((poslovi:Zakazivanje[])=>{

          this.zahteviZaOdrzavanje = poslovi.filter(p=>p.kor_ime_dekoratera==this.ulogovan.kor_ime);
          this.firmaServis.dohvSvaOdrzavanjaZaDekoratera(this.ulogovan.kor_ime).subscribe((poslovi:Zakazivanje[])=>{
            // da li on gleda samo zahteve za odrzavanje za njegove poslove; msm da da
            this.mojaOdrzavanja = poslovi;
            this.mojaOdrzavanja.forEach(p=>{
              let datum = new Date(p.datum_odrzavanja);
              let sada = new Date();
              if (datum.getTime() <= sada.getTime()){
                this.zakazivanjeServis.promeniStatusZakazivanja(p, StatusZakazivanja.Zavrseno).subscribe((resp:any)=>{
                  if(resp['message']){
                    console.log(resp['message']);
                  }
                  this.mojaOdrzavanja = this.mojaOdrzavanja.filter(obj => obj !== p);
                });
              }
            })
          })
        })
      }
    })
  }

  constructor(private ruter: Router, private firmaServis: FirmaService, private zakazivanjeServis: ZakazivanjeService, private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ulogovan : Korisnik = new Korisnik();
  zahteviZaOdrzavanje : Zakazivanje[] = [];
  mojaOdrzavanja : Zakazivanje[] = []
  datum_zavrsetka_servisiranja : string = '';

  izlogujSe() {
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);
  }

  prihvati(z: Zakazivanje){

    if(z.date_time_input != null){
      z.datum_odrzavanja = new Date(z.date_time_input);
      z.odrzavanoBarJednom = true;
      z.status = StatusZakazivanja.Servisiranje;
      this.zakazivanjeServis.prihvatiOdrzavanje(z).subscribe((resp:any)=>{
        if(resp['message']){
          this.openSnackBar(resp['message']);
        }
        this.ngOnInit();
      })
    }else{
      this.openSnackBar("Morate da uneste procenjeno vreme zavrsetka odrzavanja da biste potvrdili!")
    }
  }

  odbij(z: Zakazivanje){
    this.zakazivanjeServis.promeniStatusZakazivanja(z, StatusZakazivanja.Zavrseno).subscribe((resp: any)=>{
      if(resp['message']){
        this.openSnackBar("Uspesno ste odbili zahtev za odrzavanje!");
      }
      this.ngOnInit();
    })
  }
}
;
