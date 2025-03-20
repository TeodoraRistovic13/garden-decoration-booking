import { ZakazivanjeService } from './../services/zakazivanje.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { FirmaService } from '../services/firma.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { KomentarModalComponent } from '../komentar-modal/komentar-modal.component';
import { Recenzija } from '../models/recenzija';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusZakazivanja } from '../utils/status_zakazivanja';


@Component({
  selector: 'app-zakazivanja-vlasnik',
  templateUrl: './zakazivanja-vlasnik.component.html',
  styleUrls: ['./zakazivanja-vlasnik.component.css']
})
export class ZakazivanjaVlasnikComponent implements OnInit {


  //Pretpostavka:
  //Aktuelna zakazivanja : Zakazivanja koja su kreirana ili potvrdjena a nije im istekao rok..
  //Arhivirana zakazivanja : Zakazivanja koja su na neki nacin zavrsena..ne obradjuje se taj posao(zavrsena, odbijena, otkazana....) ili istekao je rok izrade a posao nije zavrsen

  ngOnInit(): void {

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.firmaServis.dohvZakazivanjaZaKorisnika(this.ulogovan.kor_ime).subscribe((zakazivanja : Zakazivanje[])=>{

      this.aktZakazivanja = zakazivanja.filter(z=> {
        return (z.status == StatusZakazivanja.Kreirano || z.status== StatusZakazivanja.Potvrdjeno) && this.proveraIstekaoPosao(z)== false;
      }).sort((a:Zakazivanje, b: Zakazivanje)=>{
        if (a.datum_izrade < b.datum_izrade) return -1;
        if(a.datum_izrade > b.datum_izrade) return 1;
        return 0;
      });


      this.arhZakazivanja = zakazivanja.filter(z=> {
        return z.status==StatusZakazivanja.Zavrseno ||
        z.status == StatusZakazivanja.Servisiranje ||
        z.status == StatusZakazivanja.CekaMajstora || z.status== StatusZakazivanja.Otkazano || this.proveraIstekaoPosao(z)==true;
      }).sort((a : Zakazivanje, b: Zakazivanje)=>{
        if(a.datum_zavrsetka > b.datum_zavrsetka) return -1;
        if(a.datum_zavrsetka < b.datum_zavrsetka) return 1;
        return 0;
      });
    })

  }

  constructor(private ruter: Router, private firmaServis: FirmaService, private zakazivanjeServis:ZakazivanjeService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ulogovan : Korisnik = new Korisnik();
  aktZakazivanja : Zakazivanje[] = [];
  arhZakazivanja : Zakazivanje[] = [];

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);
  }

  dozvoljenoOtkazivanje(z: Zakazivanje): boolean {
    const datumIzrade = new Date(z.datum_izrade);
    const sada = new Date();
    return datumIzrade >= new Date(sada.getTime() + 24 * 60 * 60 * 1000); //dan pre
  }


  otkaziZakazivanje(zakazivanje: Zakazivanje){

    this.zakazivanjeServis.promeniStatusZakazivanja(zakazivanje, StatusZakazivanja.Otkazano).subscribe((resp:any)=>{
      if(resp['message']){
        this.openSnackBar("Uspesno ste otkazali zakazivanje!")
        this.ngOnInit();
      }
    })
  }

  otvoriDialog(z: Zakazivanje): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {komentar: '', ocena : 0};
    dialogConfig.width = '400px';
    const dialogRef = this.dialog.open(KomentarModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {

        let recenzija = new Recenzija();
        recenzija.datum_vreme = new Date();
        recenzija.komentar = data.komentar;
        recenzija.ocena = data.ocena;
        recenzija.kor_ime = this.ulogovan.kor_ime;

        this.zakazivanjeServis.dodajRecenziju(z.id, recenzija).subscribe((resp: any)=>{
          if(resp['message']){
            this.firmaServis.azurirajProsecnuOcenuFirme(z.firma_naziv).subscribe((resp:any)=>{
              if(resp['message']){
                console.log(resp['message']);
              }
              this.openSnackBar("Hvala sto ste ostavili recenziju!")
              this.ngOnInit();
            })
          }
        })
      }
    });

  }


  proveraIstekaoPosao(z: Zakazivanje){
    let datum =new Date(z.datum_izrade);
    let sada = new Date();
    return datum.getTime() < sada.getTime();
  }

  detaljiZakazivanja(z: Zakazivanje){
    localStorage.setItem("zakazivanje", JSON.stringify(z));
    this.ruter.navigate(['zakazivanje-detalji']);
  }
}
