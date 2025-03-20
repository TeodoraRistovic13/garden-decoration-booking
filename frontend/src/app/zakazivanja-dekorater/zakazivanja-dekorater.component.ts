import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Korisnik } from '../models/user';
import { FirmaService } from '../services/firma.service';
import { Zakazivanje } from '../models/zakazivanje';
import { StatusZakazivanja } from '../utils/status_zakazivanja';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Firma } from '../models/firma';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { KomentarOdbijenicaModalComponent } from '../komentar-odbijenica-modal/komentar-odbijenica-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusNaloga } from '../utils/status_naloga';

@Component({
  selector: 'app-zakazivanja-dekorater',
  templateUrl: './zakazivanja-dekorater.component.html',
  styleUrls: ['./zakazivanja-dekorater.component.css']
})
export class ZakazivanjaDekoraterComponent implements OnInit{

  ngOnInit(): void {

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.firmaServis.dohvFirmuPoIdiju(this.ulogovan.id_firme).subscribe((firma : Firma)=>{

      if(firma != null){
        this.firmaServis.dohvZakazivanjaZaFirmu(firma.naziv).subscribe(poslovi=>{

          this.poslovi = poslovi;
          //provera za sve moje poslove da li sam dodao slike nakon 24 sata od zavrsetka
          if(this.ulogovan.status_naloga!= StatusNaloga.Blokiran){

            let mojiZavrseni = poslovi.filter(p=>
              p.status==StatusZakazivanja.Zavrseno &&
              p.slika=="" &&
              p.kor_ime_dekoratera==this.ulogovan.kor_ime
            );

            if(mojiZavrseni.length != 0){

              mojiZavrseni.forEach(p=>{
                if(this.proveraProslo24SataOdZavrsetka(p)){
                  this.userServis.azuirajPodatke(this.ulogovan.kor_ime, 'status_naloga', StatusNaloga.Blokiran).subscribe((resp:any)=>{
                    if(resp['msg']){
                      this.openSnackBar(
                        `Niste prilozili sliku za zavrsen posao (id = ${p.id}) vise od 24 sata...Nazalost od sada se blokirani za prihvatanje novih poslova...`
                      )
                      this.ulogovan.status_naloga = StatusNaloga.Blokiran;
                      localStorage.setItem("ulogovan", JSON.stringify(this.ulogovan));
                      return;
                    }
                  });
                }
              })
            }
          }
        })
      }
    })
  }

  constructor(private ruter: Router, private zakazivanjeServis: ZakazivanjeService, private firmaServis: FirmaService, private userServis: UserService, private dialog: MatDialog,private snackBar: MatSnackBar) { }

  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  ulogovan : Korisnik = new Korisnik();
  poslovi : Zakazivanje[] = [];
  fileInputIndex : number = 0;

  slikaUrl = "http://localhost:4000/uploads/";

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadProgress : number | null = null;

  onFileSelected(event:any, z : Zakazivanje, i: number){

    const file : File = event.target.files[0];
    this.fileInputIndex = i;
    if(file){
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          console.log(`Width: ${width}, Height: ${height}`);

          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            this.openSnackBar("Dozvoljeni su samo JPG i PNG formati.");
            this.resetujFileInput()
            return;
          }

          z.img_input = file.name;
        };

        img.onerror = () => {
          this.openSnackBar("Greška pri učitavanju slike. Proverite da li je datoteka ispravna.");
        };
      };

      reader.readAsDataURL(file);
    }

  }

  resetujFileInput() {
    let fileId = 'fileInput' + this.fileInputIndex;
    const fileInput = document.getElementById(fileId) as HTMLInputElement;
    fileInput.value = '';
  }

  sacuvajSliku(){

    const formData = new FormData();
    let fileId = 'fileInput' + this.fileInputIndex;

    const fileInput : HTMLInputElement | null = document.getElementById(
      fileId
    )as HTMLInputElement;

    console.log(fileInput);

    if(fileInput && fileInput.files && fileInput.files.length >0){

      formData.append('file', fileInput.files[0]);

      console.log(formData);

      this.userServis.sacuvajSliku(formData).subscribe((event:any)=>{

        if(event.type == HttpEventType.UploadProgress){

          this.uploadProgress = Math.round((100 * event.loaded/event.total));
        }
        else if(event.type = HttpEventType.Response){
          this.uploadProgress = null;
          console.log('File uploaded successfully: ', event.body);
        }else{
          console.log("Problem")
        }
      })

      console.log("File upload initiated.");

    }

  }

  otvoriDialog(z: Zakazivanje): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {komentar: ''};
    dialogConfig.width = '400px';
    const dialogRef = this.dialog.open(KomentarOdbijenicaModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.zakazivanjeServis.dodajKomentarKodOdbijenogPosla(z.id, data.komentar).subscribe((resp:any)=>{
          this.odbij(z); //promenice status
        })
      }
    });
  }

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);
  }

  sortirajZakazivanja(z: Zakazivanje[]){
    z.sort((a : Zakazivanje, b: Zakazivanje)=>{
      let a_date = new Date(a.datum_izrade);
      let b_date = new Date(b.datum_izrade);
      if (a_date > b_date){
        return 1;
      }
      if(a_date < b_date){
        return -1;
      }
      return 0;
    })
    return z;

  }

  dohvatiStringUsluga(p: Zakazivanje): string{
    let uslugeString = ""
    if(p.usluge.length == 0){
      uslugeString = "Nije izabrana nijedna usluga!"
    }
    if(p.usluge.length == 1){
      uslugeString =  p.usluge[0].naziv;
    }else{
      for(let i = 0; i < p.usluge.length - 1 ; i++){
        uslugeString += p.usluge[0].naziv + ','
      }
      uslugeString += p.usluge[p.usluge.length-1].naziv+" ";
    }
    return uslugeString;
  }

  prihvati(z : Zakazivanje){

    if(z.date_time_input != null){
      z.datum_zavrsetka = new Date(z.date_time_input);
      z.kor_ime_dekoratera = this.ulogovan.kor_ime;
      z.status= StatusZakazivanja.Potvrdjeno;
      this.zakazivanjeServis.prihvatiZakazivanje(z).subscribe((resp:any)=>{
        if(resp['msg']=='success'){
          this.openSnackBar('Uspesno prihvacen posao!')
        }
      });
    }else{
      this.openSnackBar('Morate da uneste datum da biste potvrdili zakazivanje!');
    }
  }

  odbij(p : Zakazivanje){

    this.zakazivanjeServis.promeniStatusZakazivanja(p, StatusZakazivanja.Odbijeno).subscribe((resp:any)=>{
      if(resp['msg']=='success'){
        this.openSnackBar("Uspesno ste odbili posao!")
      }
      //this.ngOnInit();
      p.status = StatusZakazivanja.Odbijeno;
    })

  }

  mojiPoslovi(p: Zakazivanje[]){

    return p.filter(p=>p.kor_ime_dekoratera==this.ulogovan.kor_ime && (p.status==StatusZakazivanja.Potvrdjeno || (p.status==StatusZakazivanja.Zavrseno && p.slika =='')));

  }

  slobodniPoslovi(p: Zakazivanje[]){
    let poslovi = p.filter(p=>{
      return p.status == StatusZakazivanja.Kreirano
    });
    return this.sortirajZakazivanja(poslovi);
  }

  zavrsi(z: Zakazivanje){

    z.status = StatusZakazivanja.Zavrseno;
    z.datum_zavrsetka = new Date();
    this.zakazivanjeServis.zavrsiZakazivanje(z).subscribe((resp: any)=>{
      if(resp['message']){
        this.openSnackBar(resp['message']);
        //this.ngOnInit();
      }
    })

  }

  dodajSliku(z:Zakazivanje){
    if(z.img_input == null){
      this.openSnackBar("Izaberite sliku prvo da biste je dodali.")
      return;
    }
    this.sacuvajSliku();
    this.zakazivanjeServis.postaviSliku(z, z.img_input).subscribe((resp:any)=>{
      if(resp['message']){
        this.openSnackBar("Uspesno dodata slika!")
        //this.ngOnInit();
        z.slika = z.img_input;
      }
    })

  }

  detaljiZakazivanja(z: Zakazivanje){

    localStorage.setItem("zakazivanje", JSON.stringify(z));
    this.ruter.navigate(['/zakazivanje-detalji']);

  }

  proveraIstekaoPosao(z: Zakazivanje){
    let datum =new Date(z.datum_zavrsetka);
    let sada = new Date();
    return datum.getTime() < sada.getTime();
  }

  proveraProslo24SataOdZavrsetka(z: Zakazivanje){
    let datum = new Date(z.datum_zavrsetka);
    let sada = new Date();

    let prosloViseOd24Sata = (sada.getTime() - datum.getTime()) > 24*60*60*1000;
    if(prosloViseOd24Sata){
      return true;
    }
    return false;
  }

}
