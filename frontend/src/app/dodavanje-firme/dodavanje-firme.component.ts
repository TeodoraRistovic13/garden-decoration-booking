import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirmaService } from '../services/firma.service';
import { Korisnik } from '../models/user';
import { Firma } from '../models/firma';
import { Usluga } from '../models/usluga';
import { TipKorisnika } from '../utils/tipoviKorisnika';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dodavanje-firme',
  templateUrl: './dodavanje-firme.component.html',
  styleUrls: ['./dodavanje-firme.component.css']
})
export class DodavanjeFirmeComponent implements OnInit {

  ngOnInit(): void {

    this.korakForme = 0;
    this.userServis.dohvatiSveKorisnike().subscribe(rez=>{
      this.korisnici = rez;
      console.log(rez);
    })
  }

  firma : Firma = new Firma();
  usluga : Usluga = new Usluga();
  korakForme : number = 0;
  korisnici : Korisnik[] = [];

  constructor(private ruter: Router, private userServis: UserService, private firmaServis : FirmaService, private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login-admin']);
  }

  dodajFirmu(){

    //treba dekorateru da se doda za koju firmu radi!
    let dekorateri = this.slobodniDekorateri().filter(k=>k.izabran==true);
    if(dekorateri.length < 2){
      this.openSnackBar('Morate izabrati minimalno 2 dekoratera da biste dodali firmu!')
      return;
    }

    this.firmaServis.dodajFirmu(this.firma).subscribe((resp: any)=>{
      if(resp['message']){
        console.log(resp['message']);
      }
      if(resp['id_firme']){
        this.firma.id = resp['id_firme'];
      }

      dekorateri.forEach(d=>{
        this.userServis.dodajFirmuZaDekoratera(d.kor_ime, this.firma.id).subscribe((resp:any)=>{
          if(resp['message']){
            console.log(resp['message']);
          }
        })
      })
      this.korakForme = 3;
    })
  }

  dodajUslugu(){
    let novaUsluga = Object.assign({}, this.usluga);
    this.firma.usluge.push(novaUsluga);
    this.openSnackBar('Dodata usluga: ' +  JSON.stringify(this.usluga));
    this.usluga.naziv = ''
    this.usluga.opis = ''
    this.usluga.cena = ''
  }

  slobodniDekorateri(): Korisnik[]{
    return this.korisnici.filter(k=>k.tip==TipKorisnika.Dekorater && k.id_firme == -1);
  }

  svaPoljaPopunjena(){
    const obaveznaPolja: (keyof Firma)[] = ['naziv', 'adresa', 'datum_kraja_godisnjeg', 'datum_pocetka_godisnjeg', 'telefon'];
    const svaPoljaPopunjena = obaveznaPolja.every(key => {
      const value = this.firma[key];
      return value && value.toString().trim().length > 0;
    });
    if (svaPoljaPopunjena && this.firma.usluge.length!=0) {
      return true;
    }
    return false;
  }

}
